using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;

namespace TalentOS.Domain.Entities;

public sealed class JobDistribution : AuditableEntity
{
    public Guid JobId { get; set; }
    public DistributionChannel Channel { get; set; }
    public DistributionStatus Status { get; set; } = DistributionStatus.Draft;
    public string Content { get; set; } = string.Empty;
    public string? ProviderReference { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public DateTime? PublishedAt { get; set; }
    public Job Job { get; set; } = null!;
}
