using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;

namespace TalentOS.Domain.Entities;

public class Interview : AuditableEntity
{
    public Guid JobApplicationId { get; set; }
    public InterviewStatus Status { get; set; } = InterviewStatus.Scheduled;
    public InterviewFormat Format { get; set; }
    public DateTime ScheduledAt { get; set; }
    public int DurationMinutes { get; set; } = 60;
    public string? MeetingLink { get; set; }
    public string? LocationDescription { get; set; }
    public string? Notes { get; set; }
    public string? CancellationReason { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? CancelledAt { get; set; }

    // Navigation properties
    public JobApplication JobApplication { get; set; } = null!;
}
