using TalentOS.Domain.Entities;

namespace TalentOS.Domain.Interfaces;

public interface IApplicantProfileRepository : IRepository<ApplicantProfile>
{
    Task<ApplicantProfile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<ApplicantProfile?> GetFullDetailsByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<ApplicantProfile?> GetWithFullDetailsAsync(Guid id, CancellationToken cancellationToken = default);
}
