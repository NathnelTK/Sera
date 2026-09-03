using Microsoft.EntityFrameworkCore;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Infrastructure.Persistence.Repositories;

public sealed class SavedJobRepository : BaseRepository<SavedJob>, ISavedJobRepository
{
    public SavedJobRepository(TalentOSDbContext context) : base(context) { }
    public async Task<IReadOnlyList<SavedJob>> GetByApplicantAsync(Guid applicantProfileId, CancellationToken cancellationToken = default)
        => await DbSet.AsNoTracking().Include(x => x.Job).ThenInclude(j => j.Company).Where(x => x.ApplicantProfileId == applicantProfileId).OrderByDescending(x => x.CreatedAt).ToListAsync(cancellationToken);
    public async Task<SavedJob?> GetByApplicantAndJobAsync(Guid applicantProfileId, Guid jobId, CancellationToken cancellationToken = default)
        => await DbSet.FirstOrDefaultAsync(x => x.ApplicantProfileId == applicantProfileId && x.JobId == jobId, cancellationToken);
}
