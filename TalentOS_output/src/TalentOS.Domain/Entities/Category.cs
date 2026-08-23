using TalentOS.Domain.Common;

namespace TalentOS.Domain.Entities;

public class Category : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? IconUrl { get; set; }
    public Guid? ParentCategoryId { get; set; }

    // Navigation properties
    public Category? ParentCategory { get; set; }
    public ICollection<Category> SubCategories { get; set; } = new List<Category>();
    public ICollection<Skill> Skills { get; set; } = new List<Skill>();
    public ICollection<Job> Jobs { get; set; } = new List<Job>();
}
