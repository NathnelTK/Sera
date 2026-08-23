using MediatR;
using TalentOS.Application.Features.Interviews.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Interviews.Queries.GetMyInterviews;

public sealed class GetMyInterviewsQueryHandler : IRequestHandler<GetMyInterviewsQuery, Result<IReadOnlyList<InterviewResponse>>>
{
    private readonly IInterviewRepository _interviews;

    public GetMyInterviewsQueryHandler(IInterviewRepository interviews) => _interviews = interviews;

    public async Task<Result<IReadOnlyList<InterviewResponse>>> Handle(GetMyInterviewsQuery request, CancellationToken cancellationToken)
    {
        var interviews = request.IsRecruiter
            ? await _interviews.GetByRecruiterAsync(request.ProfileId, cancellationToken)
            : await _interviews.GetByApplicantAsync(request.ProfileId, cancellationToken);

        var dtos = interviews.Select(i => new InterviewResponse(i.Id, i.JobApplicationId, i.Status, i.Format, i.ScheduledAt, i.DurationMinutes, i.MeetingLink, i.LocationDescription, i.Notes, i.CancellationReason, i.CompletedAt, i.CancelledAt, i.CreatedAt)).ToList();
        return Result<IReadOnlyList<InterviewResponse>>.Success(dtos);
    }
}
