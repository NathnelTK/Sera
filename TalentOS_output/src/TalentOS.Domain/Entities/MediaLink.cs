using TalentOS.Domain.Common;

namespace TalentOS.Domain.Entities;

public class MediaLink : BaseEntity
{
    public Guid ApplicantProfileId { get; set; }
    public string Platform { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string? DisplayLabel { get; set; }

    // Navigation properties
    public ApplicantProfile ApplicantProfile { get; set; } = null!;
}
