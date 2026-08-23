using TalentOS.Domain.Entities;
using TalentOS.Domain.Enums;

namespace TalentOS.Domain.Interfaces;

public interface IVerificationRepository : IRepository<Verification>
{
    Task<IReadOnlyList<Verification>> GetByUserAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Verification>> GetPendingAsync(CancellationToken cancellationToken = default);
    Task<Verification?> GetWithDocumentsAsync(Guid id, CancellationToken cancellationToken = default);
}
