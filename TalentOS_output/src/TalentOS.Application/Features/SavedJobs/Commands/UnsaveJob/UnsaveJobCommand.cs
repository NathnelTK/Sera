using MediatR;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.SavedJobs.Commands.UnsaveJob;
public sealed record UnsaveJobCommand(Guid UserId, Guid JobId) : IRequest<Result>;
