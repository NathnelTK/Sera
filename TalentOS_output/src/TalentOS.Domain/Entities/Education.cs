using TalentOS.Domain.Common;

namespace TalentOS.Domain.Entities;

public class Education : AuditableEntity
{
    public Guid ApplicantProfileId { get; set; }
    public string Institution { get; set; } = string.Empty;
    public string Degree { get; set; } = string.Empty;
    public string FieldOfStudy { get; set; } = string.Empty;
    public string? Grade { get; set; }
    public string? Description { get; set; }
    public int StartYear { get; set; }
    public int? EndYear { get; set; }
    public bool IsOngoing { get; set; }

    // Navigation properties
    public ApplicantProfile ApplicantProfile { get; set; } = null!;
}
