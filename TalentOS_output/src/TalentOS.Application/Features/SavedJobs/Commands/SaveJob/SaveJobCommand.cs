using MediatR;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.SavedJobs.Commands.SaveJob;
public sealed record SaveJobCommand(Guid UserId, Guid JobId) : IRequest<Result>;
