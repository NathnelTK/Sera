using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.Interviews.DTOs;

public sealed record InterviewResponse(
    Guid Id,
    Guid JobApplicationId,
    InterviewStatus Status,
    InterviewFormat Format,
    DateTime ScheduledAt,
    int DurationMinutes,
    string? MeetingLink,
    string? LocationDescription,
    string? Notes,
    string? CancellationReason,
    DateTime? CompletedAt,
    DateTime? CancelledAt,
    DateTime CreatedAt
);

public sealed record ScheduleInterviewRequest(
    Guid JobApplicationId,
    InterviewFormat Format,
    DateTime ScheduledAt,
    int DurationMinutes,
    string? MeetingLink,
    string? LocationDescription,
    string? Notes
);

public sealed record UpdateInterviewRequest(
    InterviewFormat Format,
    DateTime ScheduledAt,
    int DurationMinutes,
    string? MeetingLink,
    string? LocationDescription,
    string? Notes
);
