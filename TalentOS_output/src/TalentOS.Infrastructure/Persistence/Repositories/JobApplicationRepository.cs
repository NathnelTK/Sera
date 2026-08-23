using Microsoft.EntityFrameworkCore;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Interfaces;
using TalentOS.Infrastructure.Persistence;

namespace TalentOS.Infrastructure.Persistence.Repositories;

public sealed class JobApplicationRepository : BaseRepository<JobApplication>, IJobApplicationRepository
{
    public JobApplicationRepository(TalentOSDbContext context) : base(context) { }

    public async Task<IReadOnlyList<JobApplication>> GetByApplicantAsync(Guid applicantProfileId, CancellationToken cancellationToken = default)
        => await DbSet.AsNoTracking()
            .Include(a => a.Job).ThenInclude(j => j.Company)
            .Where(a => a.ApplicantProfileId == applicantProfileId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<JobApplication>> GetByJobAsync(Guid jobId, CancellationToken cancellationToken = default)
        => await DbSet.AsNoTracking()
            .Include(a => a.ApplicantProfile)
            .Where(a => a.JobId == jobId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(cancellationToken);

    public async Task<bool> HasAppliedAsync(Guid jobId, Guid applicantProfileId, CancellationToken cancellationToken = default)
        => await DbSet.AnyAsync(a => a.JobId == jobId && a.ApplicantProfileId == applicantProfileId, cancellationToken);

    public async Task<JobApplication?> GetWithDetailsAsync(Guid id, CancellationToken cancellationToken = default)
        => await DbSet
            .Include(a => a.Job).ThenInclude(j => j.Company)
            .Include(a => a.ApplicantProfile)
            .Include(a => a.CV)
            .Include(a => a.Interviews)
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
}
