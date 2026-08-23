using TalentOS.Domain.Common;

namespace TalentOS.Domain.Entities;

public class JobSkill : BaseEntity
{
    public Guid JobId { get; set; }
    public Guid SkillId { get; set; }
    public bool IsRequired { get; set; }

    // Navigation properties
    public Job Job { get; set; } = null!;
    public Skill Skill { get; set; } = null!;
}
