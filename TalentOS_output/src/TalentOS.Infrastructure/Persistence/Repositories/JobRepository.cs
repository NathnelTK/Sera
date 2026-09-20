using Microsoft.EntityFrameworkCore;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Enums;
using TalentOS.Domain.Interfaces;
using TalentOS.Infrastructure.Persistence;

namespace TalentOS.Infrastructure.Persistence.Repositories;

public sealed class JobRepository : BaseRepository<Job>, IJobRepository
{
    public JobRepository(TalentOSDbContext context) : base(context) { }

    public async Task<IReadOnlyList<Job>> GetByRecruiterAsync(Guid recruiterProfileId, CancellationToken cancellationToken = default)
        => await DbSet.AsNoTracking()
            .Include(j => j.Recruiter)
            .Include(j => j.Company)
            .Include(j => j.Category)
            .Include(j => j.Location)
            .Where(j => j.RecruiterProfileId == recruiterProfileId)
            .OrderByDescending(j => j.CreatedAt)
            .ToListAsync(cancellationToken);

    public async Task<(IReadOnlyList<Job> Jobs, int TotalCount)> GetPublishedAsync(
        int skip,
        int take,
        string? searchTerm,
        string? sortBy,
        string? category,
        string? location,
        JobType? jobType,
        WorkMode? workMode,
        CancellationToken cancellationToken = default)
    {
        var query = DbSet.AsNoTracking()
            .Include(j => j.Recruiter)
            .Include(j => j.Company)
            .Include(j => j.Category)
            .Include(j => j.Location)
            .Include(j => j.RequiredSkills).ThenInclude(js => js.Skill)
            .Include(j => j.Tags)
            .Where(j => j.Status == JobStatus.Published);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLowerInvariant();
            query = query.Where(j =>
                j.Title.ToLower().Contains(term) ||
                j.Description.ToLower().Contains(term) ||
                (j.Requirements != null && j.Requirements.ToLower().Contains(term)) ||
                (j.Company != null && j.Company.Name.ToLower().Contains(term)) ||
                j.RequiredSkills.Any(js => js.Skill.Name.ToLower().Contains(term)) ||
                j.Tags.Any(t => t.Name.ToLower().Contains(term)));
        }

        if (!string.IsNullOrWhiteSpace(category))
        {
            var categoryTerm = category.Trim().ToLowerInvariant();
            var technologyTerms = new[]
            {
                "technology", "tech", "it", "software", "web", "backend", "frontend",
                "devops", "cybersecurity", "cyber security", "developer", "engineering"
            };

            if (technologyTerms.Contains(categoryTerm))
            {
                // Older seeded jobs do not all have a Category relationship. Keep those jobs
                // discoverable while the data is being normalized by matching the job's domain.
                query = query.Where(j =>
                    (j.Category != null && (j.Category.Name.ToLower() == "technology" ||
                                             j.Category.Name.ToLower() == "tech" ||
                                             j.Category.Name.ToLower() == "it")) ||
                    j.Title.ToLower().Contains("software") ||
                    j.Title.ToLower().Contains("developer") ||
                    j.Title.ToLower().Contains("devops") ||
                    j.Title.ToLower().Contains("cyber") ||
                    j.Title.ToLower().Contains("it support") ||
                    j.Title.ToLower().Contains("web ") ||
                    j.Description.ToLower().Contains("software development") ||
                    j.Description.ToLower().Contains("information technology"));
            }
            else
            {
                query = query.Where(j => j.Category != null && j.Category.Name.ToLower() == categoryTerm);
            }
        }

        if (!string.IsNullOrWhiteSpace(location))
        {
            var locationTerm = location.Trim().ToLowerInvariant();
            query = query.Where(j => j.Location != null &&
                (j.Location.City.ToLower().Contains(locationTerm) ||
                 j.Location.Country.ToLower().Contains(locationTerm) ||
                 (j.Location.State != null && j.Location.State.ToLower().Contains(locationTerm))));
        }

        if (jobType.HasValue)
            query = query.Where(j => j.JobType == jobType.Value);

        if (workMode.HasValue)
            query = query.Where(j => j.WorkMode == workMode.Value);

        query = sortBy?.ToLowerInvariant() switch
        {
            "oldest" => query.OrderBy(j => j.PublishedAt),
            "salary_asc" => query.OrderBy(j => j.MinimumSalary),
            "salary_desc" => query.OrderByDescending(j => j.MaximumSalary),
            _ => query.OrderByDescending(j => j.PublishedAt)
        };

        var total = await query.CountAsync(cancellationToken);
        var jobs = await query.Skip(skip).Take(take).ToListAsync(cancellationToken);
        return (jobs, total);
    }

    public async Task<Job?> GetWithDetailsAsync(Guid jobId, CancellationToken cancellationToken = default)
        => await DbSet
            .Include(j => j.Recruiter).ThenInclude(r => r.User)
            .Include(j => j.Company)
            .Include(j => j.Location)
            .Include(j => j.RequiredSkills).ThenInclude(js => js.Skill)
            .Include(j => j.Tags)
            .Include(j => j.Applications)
            .FirstOrDefaultAsync(j => j.Id == jobId, cancellationToken);

    public async Task<Job?> GetWithApplicationsAsync(Guid jobId, CancellationToken cancellationToken = default)
        => await DbSet
            .Include(j => j.Applications)
            .FirstOrDefaultAsync(j => j.Id == jobId, cancellationToken);
}
