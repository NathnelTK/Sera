using TalentOS.Domain.Entities;

namespace TalentOS.Domain.Interfaces;

public interface ISavedJobRepository : IRepository<SavedJob>
{
    Task<IReadOnlyList<SavedJob>> GetByApplicantAsync(Guid applicantProfileId, CancellationToken cancellationToken = default);
    Task<SavedJob?> GetByApplicantAndJobAsync(Guid applicantProfileId, Guid jobId, CancellationToken cancellationToken = default);
}
