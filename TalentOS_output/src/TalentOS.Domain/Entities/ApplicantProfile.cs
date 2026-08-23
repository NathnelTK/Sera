using TalentOS.Domain.Common;

namespace TalentOS.Domain.Entities;

public class ApplicantProfile : AuditableEntity
{
    public Guid UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Headline { get; set; }
    public string? Summary { get; set; }
    public string? Phone { get; set; }
    public string? AvatarUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? GitHubUrl { get; set; }
    public string? PortfolioUrl { get; set; }
    public bool IsOpenToWork { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Location? Location { get; set; }
    public ICollection<CV> CVs { get; set; } = new List<CV>();
    public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
    public ICollection<ApplicantSkill> Skills { get; set; } = new List<ApplicantSkill>();
    public ICollection<Education> Educations { get; set; } = new List<Education>();
    public ICollection<Experience> Experiences { get; set; } = new List<Experience>();
    public ICollection<Document> Documents { get; set; } = new List<Document>();
    public ICollection<MediaLink> MediaLinks { get; set; } = new List<MediaLink>();
}
