using TalentOS.Domain.Entities;

namespace TalentOS.Domain.Interfaces;

public interface IRecruiterProfileRepository : IRepository<RecruiterProfile>
{
    Task<RecruiterProfile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<RecruiterProfile?> GetWithCompanyAsync(Guid id, CancellationToken cancellationToken = default);
}
