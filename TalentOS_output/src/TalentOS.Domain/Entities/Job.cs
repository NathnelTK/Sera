using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;

namespace TalentOS.Domain.Entities;

public class Job : AuditableEntity
{
    public Guid RecruiterProfileId { get; set; }
    public Guid? CompanyId { get; set; }
    public Guid? CategoryId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Requirements { get; set; }
    public string? Benefits { get; set; }
    public JobType JobType { get; set; }
    public WorkMode WorkMode { get; set; }
    public ExperienceLevel ExperienceLevel { get; set; }
    public decimal? MinimumSalary { get; set; }
    public decimal? MaximumSalary { get; set; }
    public string? SalaryCurrency { get; set; }
    public DateTime? DeadlineAt { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime? ClosedAt { get; set; }
    public JobStatus Status { get; set; } = JobStatus.Draft;

    // Navigation properties
    public RecruiterProfile Recruiter { get; set; } = null!;
    public Company? Company { get; set; }
    public Category? Category { get; set; }
    public Location? Location { get; set; }
    public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
    public ICollection<JobSkill> RequiredSkills { get; set; } = new List<JobSkill>();
    public ICollection<Tag> Tags { get; set; } = new List<Tag>();
}
