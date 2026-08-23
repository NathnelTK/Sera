using TalentOS.Domain.Entities;
using TalentOS.Domain.Enums;

namespace TalentOS.Domain.Interfaces;

public interface IDocumentRepository : IRepository<Document>
{
    Task<IReadOnlyList<Document>> GetByApplicantAsync(Guid applicantProfileId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Document>> GetByVerificationAsync(Guid verificationId, CancellationToken cancellationToken = default);
}
