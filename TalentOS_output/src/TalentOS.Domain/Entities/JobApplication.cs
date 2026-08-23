using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;

namespace TalentOS.Domain.Entities;

public class JobApplication : AuditableEntity
{
    public Guid JobId { get; set; }
    public Guid ApplicantProfileId { get; set; }
    public Guid? CvId { get; set; }
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Submitted;
    public string? CoverLetter { get; set; }
    public double? MatchScore { get; set; }
    public string? AiSummary { get; set; }
    public string? RejectionReason { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public DateTime? WithdrawnAt { get; set; }

    // Navigation properties
    public Job Job { get; set; } = null!;
    public ApplicantProfile ApplicantProfile { get; set; } = null!;
    public CV? CV { get; set; }
    public ICollection<Document> AdditionalDocuments { get; set; } = new List<Document>();
    public ICollection<Interview> Interviews { get; set; } = new List<Interview>();
}
