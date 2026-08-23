using MediatR;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Applications.Commands.WithdrawApplication;

public record WithdrawApplicationCommand(Guid ApplicationId) : IRequest<Result>;
