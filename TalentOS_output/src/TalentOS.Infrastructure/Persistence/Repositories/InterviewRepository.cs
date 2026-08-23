using Microsoft.EntityFrameworkCore;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Interfaces;
using TalentOS.Infrastructure.Persistence;

namespace TalentOS.Infrastructure.Persistence.Repositories;

public sealed class InterviewRepository : BaseRepository<Interview>, IInterviewRepository
{
    public InterviewRepository(TalentOSDbContext context) : base(context) { }

    public async Task<IReadOnlyList<Interview>> GetByApplicationAsync(Guid jobApplicationId, CancellationToken cancellationToken = default)
        => await DbSet.AsNoTracking().Where(i => i.JobApplicationId == jobApplicationId).OrderByDescending(i => i.ScheduledAt).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Interview>> GetByApplicantAsync(Guid applicantProfileId, CancellationToken cancellationToken = default)
        => await DbSet.AsNoTracking()
            .Include(i => i.JobApplication).ThenInclude(a => a.ApplicantProfile)
            .Where(i => i.JobApplication.ApplicantProfileId == applicantProfileId)
            .OrderByDescending(i => i.ScheduledAt).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Interview>> GetByRecruiterAsync(Guid recruiterProfileId, CancellationToken cancellationToken = default)
        => await DbSet.AsNoTracking()
            .Include(i => i.JobApplication).ThenInclude(a => a.Job)
            .Where(i => i.JobApplication.Job.RecruiterProfileId == recruiterProfileId)
            .OrderByDescending(i => i.ScheduledAt).ToListAsync(cancellationToken);
}
