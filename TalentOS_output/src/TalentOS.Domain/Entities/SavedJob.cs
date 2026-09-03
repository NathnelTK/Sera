using TalentOS.Domain.Common;

namespace TalentOS.Domain.Entities;

public sealed class SavedJob : BaseEntity
{
    public Guid ApplicantProfileId { get; set; }
    public Guid JobId { get; set; }
    public ApplicantProfile ApplicantProfile { get; set; } = null!;
    public Job Job { get; set; } = null!;
}
