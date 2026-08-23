using MediatR;
using TalentOS.Application.Features.Interviews.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Interviews.Queries.GetInterviewById;

public record GetInterviewByIdQuery(Guid InterviewId) : IRequest<Result<InterviewResponse>>;
