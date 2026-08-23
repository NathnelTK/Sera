using MediatR;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Jobs.Commands.PublishJob;

public record PublishJobCommand(Guid JobId) : IRequest<Result>;
