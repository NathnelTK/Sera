using MediatR;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Interviews.Commands.CancelInterview;

public record CancelInterviewCommand(Guid InterviewId, string? Reason) : IRequest<Result>;
