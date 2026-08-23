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
            .Include(j => j.Company)
            .Where(j => j.RecruiterProfileId == recruiterProfileId)
            .OrderByDescending(j => j.CreatedAt)
            .ToListAsync(cancellationToken);

    public async Task<(IReadOnlyList<Job> Jobs, int TotalCount)> GetPublishedAsync(int skip, int take, string? searchTerm, string? sortBy, CancellationToken cancellationToken = default)
    {
        var query = DbSet.AsNoTracking()
            .Include(j => j.Recruiter)
            .Include(j => j.Company)
            .Where(j => j.Status == JobStatus.Published);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLowerInvariant();
            query = query.Where(j =>
                j.Title.ToLower().Contains(term) ||
                j.Description.ToLower().Contains(term));
        }

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
