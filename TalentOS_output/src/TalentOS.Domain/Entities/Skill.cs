using TalentOS.Domain.Common;

namespace TalentOS.Domain.Entities;

public class Skill : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? CategoryId { get; set; }

    // Navigation properties
    public Category? Category { get; set; }
    public ICollection<ApplicantSkill> ApplicantSkills { get; set; } = new List<ApplicantSkill>();
    public ICollection<JobSkill> JobSkills { get; set; } = new List<JobSkill>();
}
