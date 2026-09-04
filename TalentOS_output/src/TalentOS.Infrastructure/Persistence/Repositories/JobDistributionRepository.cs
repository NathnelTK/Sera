using Microsoft.EntityFrameworkCore;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Enums;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Infrastructure.Persistence.Repositories;

public sealed class JobDistributionRepository : BaseRepository<JobDistribution>, IJobDistributionRepository
{
    public JobDistributionRepository(TalentOSDbContext context) : base(context) { }
    public async Task<IReadOnlyList<JobDistribution>> GetByJobAsync(Guid jobId, CancellationToken ct = default) => await DbSet.AsNoTracking().Where(x => x.JobId == jobId).OrderBy(x => x.Channel).ToListAsync(ct);
    public async Task<JobDistribution?> GetByJobAndChannelAsync(Guid jobId, DistributionChannel channel, CancellationToken ct = default) => await DbSet.FirstOrDefaultAsync(x => x.JobId == jobId && x.Channel == channel, ct);
}
