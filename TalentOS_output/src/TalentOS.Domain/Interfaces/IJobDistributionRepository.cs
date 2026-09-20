using TalentOS.Domain.Entities;

namespace TalentOS.Domain.Interfaces;

public interface IJobDistributionRepository : IRepository<JobDistribution>
{
    Task<IReadOnlyList<JobDistribution>> GetByJobAsync(Guid jobId, CancellationToken cancellationToken = default);
    Task<JobDistribution?> GetByJobAndChannelAsync(Guid jobId, Domain.Enums.DistributionChannel channel, CancellationToken cancellationToken = default);
}
