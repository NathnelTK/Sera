using MediatR;
using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.Interviews.Commands.ScheduleInterview;

public record ScheduleInterviewCommand(
    Guid JobApplicationId,
    InterviewFormat Format,
    DateTime ScheduledAt,
    int DurationMinutes,
    string? MeetingLink,
    string? LocationDescription,
    string? Notes
) : IRequest<Result<Guid>>;
