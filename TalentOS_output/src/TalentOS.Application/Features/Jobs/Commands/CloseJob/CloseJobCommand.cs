using MediatR;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Jobs.Commands.CloseJob;

public record CloseJobCommand(Guid JobId) : IRequest<Result>;
