using MediatR;
using TalentOS.Application.Features.Interviews.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Interviews.Queries.GetInterviewById;

public sealed class GetInterviewByIdQueryHandler : IRequestHandler<GetInterviewByIdQuery, Result<InterviewResponse>>
{
    private readonly IInterviewRepository _interviews;

    public GetInterviewByIdQueryHandler(IInterviewRepository interviews) => _interviews = interviews;

    public async Task<Result<InterviewResponse>> Handle(GetInterviewByIdQuery request, CancellationToken cancellationToken)
    {
        var interview = await _interviews.GetByIdAsync(request.InterviewId, cancellationToken);
        if (interview is null) return Result<InterviewResponse>.Failure("Interview not found.");

        return Result<InterviewResponse>.Success(new InterviewResponse(interview.Id, interview.JobApplicationId, interview.Status, interview.Format, interview.ScheduledAt, interview.DurationMinutes, interview.MeetingLink, interview.LocationDescription, interview.Notes, interview.CancellationReason, interview.CompletedAt, interview.CancelledAt, interview.CreatedAt));
    }
}
