using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;

namespace TalentOS.Domain.Entities;

public class RecruiterProfile : AuditableEntity
{
    public Guid UserId { get; set; }
    public Guid? CompanyId { get; set; }
    public RecruiterType RecruiterType { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Phone { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Company? Company { get; set; }
    public ICollection<Job> PostedJobs { get; set; } = new List<Job>();
}
