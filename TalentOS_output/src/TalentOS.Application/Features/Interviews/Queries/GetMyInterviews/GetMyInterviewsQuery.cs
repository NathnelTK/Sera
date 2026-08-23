using MediatR;
using TalentOS.Application.Features.Interviews.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Interviews.Queries.GetMyInterviews;

public record GetMyInterviewsQuery(Guid ProfileId, bool IsRecruiter) : IRequest<Result<IReadOnlyList<InterviewResponse>>>;
