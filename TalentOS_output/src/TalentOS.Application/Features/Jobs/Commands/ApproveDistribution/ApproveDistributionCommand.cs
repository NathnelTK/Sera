using MediatR;
using TalentOS.Domain.Common;
namespace TalentOS.Application.Features.Jobs.Commands.ApproveDistribution;
public sealed record ApproveDistributionCommand(Guid UserId, Guid DistributionId, string Content) : IRequest<Result>;
