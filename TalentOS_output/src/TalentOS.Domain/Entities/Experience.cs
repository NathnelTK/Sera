using TalentOS.Domain.Common;

namespace TalentOS.Domain.Entities;

public class Experience : AuditableEntity
{
    public Guid ApplicantProfileId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? EmploymentType { get; set; }
    public string? LocationDescription { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrentPosition { get; set; }

    // Navigation properties
    public ApplicantProfile ApplicantProfile { get; set; } = null!;
}
