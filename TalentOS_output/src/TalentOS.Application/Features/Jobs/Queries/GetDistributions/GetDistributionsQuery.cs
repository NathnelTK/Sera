using MediatR;
using TalentOS.Domain.Common;
using TalentOS.Domain.Entities;

namespace TalentOS.Application.Features.Jobs.Queries.GetDistributions;
public sealed record GetDistributionsQuery(Guid UserId, Guid JobId) : IRequest<Result<IReadOnlyList<JobDistribution>>>;
