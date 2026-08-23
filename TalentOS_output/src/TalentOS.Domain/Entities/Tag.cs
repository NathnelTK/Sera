using TalentOS.Domain.Common;

namespace TalentOS.Domain.Entities;

public class Tag : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    // Navigation properties
    public ICollection<Job> Jobs { get; set; } = new List<Job>();
}
