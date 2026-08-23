using TalentOS.Domain.Entities;

namespace TalentOS.Domain.Interfaces;

public interface IInterviewRepository : IRepository<Interview>
{
    Task<IReadOnlyList<Interview>> GetByApplicationAsync(Guid jobApplicationId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Interview>> GetByApplicantAsync(Guid applicantProfileId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Interview>> GetByRecruiterAsync(Guid recruiterProfileId, CancellationToken cancellationToken = default);
}
