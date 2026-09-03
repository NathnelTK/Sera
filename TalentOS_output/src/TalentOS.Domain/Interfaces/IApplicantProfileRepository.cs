using TalentOS.Domain.Entities;

namespace TalentOS.Domain.Interfaces;

public interface IApplicantProfileRepository : IRepository<ApplicantProfile>
{
    Task<(IReadOnlyList<ApplicantProfile> Profiles, int TotalCount)> DiscoverAsync(
        int skip, int take, string? search, string? location, string? skill, bool openToWorkOnly,
        CancellationToken cancellationToken = default);
    Task<ApplicantProfile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<ApplicantProfile?> GetFullDetailsByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<ApplicantProfile?> GetWithFullDetailsAsync(Guid id, CancellationToken cancellationToken = default);
}
