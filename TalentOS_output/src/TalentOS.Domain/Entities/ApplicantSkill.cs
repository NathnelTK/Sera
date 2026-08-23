using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;

namespace TalentOS.Domain.Entities;

public class ApplicantSkill : BaseEntity
{
    public Guid ApplicantProfileId { get; set; }
    public Guid SkillId { get; set; }
    public SkillLevel Level { get; set; }
    public int? YearsOfExperience { get; set; }

    // Navigation properties
    public ApplicantProfile ApplicantProfile { get; set; } = null!;
    public Skill Skill { get; set; } = null!;
}
