using TalentOS.Domain.Common;

namespace TalentOS.Domain.Entities;

public class CV : AuditableEntity
{
    public Guid ApplicantProfileId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public bool IsPrimary { get; set; }
    public string? RawTextContent { get; set; }
    public string? ParsedJson { get; set; }

    // Navigation properties
    public ApplicantProfile ApplicantProfile { get; set; } = null!;
}
