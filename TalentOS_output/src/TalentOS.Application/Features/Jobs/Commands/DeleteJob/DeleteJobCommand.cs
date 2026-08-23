using MediatR;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Jobs.Commands.DeleteJob;

public record DeleteJobCommand(Guid JobId) : IRequest<Result>;
