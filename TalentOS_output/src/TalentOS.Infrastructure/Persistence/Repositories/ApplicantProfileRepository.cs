using Microsoft.EntityFrameworkCore;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Interfaces;
using TalentOS.Infrastructure.Persistence;

namespace TalentOS.Infrastructure.Persistence.Repositories;

public sealed class ApplicantProfileRepository : BaseRepository<ApplicantProfile>, IApplicantProfileRepository
{
    public ApplicantProfileRepository(TalentOSDbContext context) : base(context) { }

    public async Task<ApplicantProfile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        => await DbSet.Include(a => a.User).Include(a => a.Location).FirstOrDefaultAsync(a => a.UserId == userId, cancellationToken);

    public async Task<(IReadOnlyList<ApplicantProfile> Profiles, int TotalCount)> DiscoverAsync(
        int skip, int take, string? search, string? location, string? skill, bool openToWorkOnly,
        CancellationToken cancellationToken = default)
    {
        var query = FullDetails().Where(a => a.User.IsActive);
        if (openToWorkOnly) query = query.Where(a => a.IsOpenToWork);
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLowerInvariant();
            query = query.Where(a => (a.FirstName + " " + a.LastName).ToLower().Contains(term)
                || (a.Headline != null && a.Headline.ToLower().Contains(term))
                || (a.Summary != null && a.Summary.ToLower().Contains(term))
                || a.Skills.Any(s => s.Skill.Name.ToLower().Contains(term)));
        }
        if (!string.IsNullOrWhiteSpace(location))
        {
            var term = location.Trim().ToLowerInvariant();
            query = query.Where(a => a.Location != null && (a.Location.City.ToLower().Contains(term)
                || a.Location.Country.ToLower().Contains(term)
                || (a.Location.State != null && a.Location.State.ToLower().Contains(term))));
        }
        if (!string.IsNullOrWhiteSpace(skill))
        {
            var term = skill.Trim().ToLowerInvariant();
            query = query.Where(a => a.Skills.Any(s => s.Skill.Name.ToLower().Contains(term)));
        }
        var total = await query.CountAsync(cancellationToken);
        var profiles = await query.OrderBy(a => a.LastName).ThenBy(a => a.FirstName)
            .Skip(skip).Take(take).ToListAsync(cancellationToken);
        return (profiles, total);
    }

    public async Task<ApplicantProfile?> GetFullDetailsByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        => await FullDetails().FirstOrDefaultAsync(a => a.UserId == userId, cancellationToken);

    public async Task<ApplicantProfile?> GetWithFullDetailsAsync(Guid id, CancellationToken cancellationToken = default)
        => await FullDetails().FirstOrDefaultAsync(a => a.Id == id, cancellationToken);

    private IQueryable<ApplicantProfile> FullDetails()
        => DbSet.AsNoTracking()
            .Include(a => a.User)
            .Include(a => a.Location)
            .Include(a => a.Skills).ThenInclude(s => s.Skill)
            .Include(a => a.Educations)
            .Include(a => a.Experiences)
            .Include(a => a.CVs)
            .Include(a => a.MediaLinks);
}
