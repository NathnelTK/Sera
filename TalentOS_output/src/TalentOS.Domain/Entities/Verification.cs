using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;

namespace TalentOS.Domain.Entities;

public class Verification : AuditableEntity
{
    public Guid UserId { get; set; }
    public Guid? CompanyId { get; set; }
    public VerificationType VerificationType { get; set; }
    public VerificationStatus Status { get; set; } = VerificationStatus.Pending;
    public string? Notes { get; set; }
    public string? RejectionReason { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public Guid? ReviewedBy { get; set; }

    // Identity-document payload (e.g. a decoded Fayda national ID).
    // The document is decoded and its signature checked on-device by the client (fayda-decoder);
    // we persist only the reference number, the decoded fields, and the signature outcome.
    public string? ReferenceNumber { get; set; }
    public string? DecodedPayloadJson { get; set; }
    public bool SignatureVerified { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Company? Company { get; set; }
    public ICollection<Document> SupportingDocuments { get; set; } = new List<Document>();
}
