using TalentOS.Domain.Entities;
using TalentOS.Domain.Enums;

namespace TalentOS.Domain.Interfaces;

public interface IJobRepository : IRepository<Job>
{
    Task<IReadOnlyList<Job>> GetByRecruiterAsync(Guid recruiterProfileId, CancellationToken cancellationToken = default);
    Task<(IReadOnlyList<Job> Jobs, int TotalCount)> GetPublishedAsync(
        int skip,
        int take,
        string? searchTerm,
        string? sortBy,
        string? category,
        string? location,
        JobType? jobType,
        WorkMode? workMode,
        CancellationToken cancellationToken = default);
    Task<Job?> GetWithDetailsAsync(Guid jobId, CancellationToken cancellationToken = default);
    Task<Job?> GetWithApplicationsAsync(Guid jobId, CancellationToken cancellationToken = default);
}
