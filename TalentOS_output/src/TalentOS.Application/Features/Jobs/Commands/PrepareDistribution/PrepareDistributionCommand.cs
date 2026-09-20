using MediatR;
using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;
namespace TalentOS.Application.Features.Jobs.Commands.PrepareDistribution;
public sealed record PrepareDistributionCommand(Guid UserId, Guid JobId, IReadOnlyList<DistributionChannel> Channels) : IRequest<Result>;
