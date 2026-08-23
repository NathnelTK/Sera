using TalentOS.Domain.Entities;

namespace TalentOS.Domain.Interfaces;

public interface IJobApplicationRepository : IRepository<JobApplication>
{
    Task<IReadOnlyList<JobApplication>> GetByApplicantAsync(Guid applicantProfileId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<JobApplication>> GetByJobAsync(Guid jobId, CancellationToken cancellationToken = default);
    Task<bool> HasAppliedAsync(Guid jobId, Guid applicantProfileId, CancellationToken cancellationToken = default);
    Task<JobApplication?> GetWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
}
