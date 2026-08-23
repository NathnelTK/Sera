using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;

namespace TalentOS.Domain.Entities;

public class Company : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Website { get; set; }
    public string? LogoUrl { get; set; }
    public string? Industry { get; set; }
    public string? Size { get; set; }
    public string? FoundedYear { get; set; }
    public VerificationStatus VerificationStatus { get; set; } = VerificationStatus.Pending;

    // Navigation properties
    public Location? HeadquartersLocation { get; set; }
    public ICollection<RecruiterProfile> Recruiters { get; set; } = new List<RecruiterProfile>();
    public ICollection<Job> Jobs { get; set; } = new List<Job>();
    public ICollection<Verification> Verifications { get; set; } = new List<Verification>();
}
