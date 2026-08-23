using Microsoft.EntityFrameworkCore;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Interfaces;
using TalentOS.Infrastructure.Persistence;

namespace TalentOS.Infrastructure.Persistence.Repositories;

public sealed class ApplicantProfileRepository : BaseRepository<ApplicantProfile>, IApplicantProfileRepository
{
    public ApplicantProfileRepository(TalentOSDbContext context) : base(context) { }

    public async Task<ApplicantProfile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        => await DbSet.Include(a => a.User).FirstOrDefaultAsync(a => a.UserId == userId, cancellationToken);

    public async Task<ApplicantProfile?> GetWithFullDetailsAsync(Guid id, CancellationToken cancellationToken = default)
        => await DbSet
            .Include(a => a.User)
            .Include(a => a.Location)
            .Include(a => a.Skills).ThenInclude(s => s.Skill)
            .Include(a => a.Educations)
            .Include(a => a.Experiences)
            .Include(a => a.CVs)
            .Include(a => a.MediaLinks)
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
}
