using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;

namespace TalentOS.Domain.Entities;

public class Document : AuditableEntity
{
    public Guid UploadedByUserId { get; set; }
    public Guid? ApplicantProfileId { get; set; }
    public Guid? VerificationId { get; set; }
    public Guid? JobApplicationId { get; set; }
    public DocumentType DocumentType { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public string? MimeType { get; set; }
    public string? Description { get; set; }

    // Navigation properties
    public User UploadedBy { get; set; } = null!;
}
