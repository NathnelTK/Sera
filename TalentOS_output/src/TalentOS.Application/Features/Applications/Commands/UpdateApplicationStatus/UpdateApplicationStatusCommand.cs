using MediatR;
using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.Applications.Commands.UpdateApplicationStatus;

public record UpdateApplicationStatusCommand(Guid ApplicationId, ApplicationStatus Status, string? RejectionReason) : IRequest<Result>;
