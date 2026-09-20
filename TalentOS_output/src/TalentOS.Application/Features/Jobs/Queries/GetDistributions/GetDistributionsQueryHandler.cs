using MediatR;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Jobs.Queries.GetDistributions;
public sealed class GetDistributionsQueryHandler : IRequestHandler<GetDistributionsQuery, Result<IReadOnlyList<Domain.Entities.JobDistribution>>>
{
    private readonly IJobRepository _jobs; private readonly IRecruiterProfileRepository _recruiters; private readonly IJobDistributionRepository _distributions;
    public GetDistributionsQueryHandler(IJobRepository jobs, IRecruiterProfileRepository recruiters, IJobDistributionRepository distributions) { _jobs = jobs; _recruiters = recruiters; _distributions = distributions; }
    public async Task<Result<IReadOnlyList<Domain.Entities.JobDistribution>>> Handle(GetDistributionsQuery request, CancellationToken ct) { var recruiter = await _recruiters.GetByUserIdAsync(request.UserId, ct); var job = await _jobs.GetByIdAsync(request.JobId, ct); if (recruiter is null || job is null || job.RecruiterProfileId != recruiter.Id) return Result<IReadOnlyList<Domain.Entities.JobDistribution>>.Failure("You do not own this job."); return Result<IReadOnlyList<Domain.Entities.JobDistribution>>.Success(await _distributions.GetByJobAsync(request.JobId, ct)); }
}
