using MediatR;
using TalentOS.Application.Features.Jobs.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Jobs.Queries.GetRecruiterJobs;

public sealed class GetRecruiterJobsQueryHandler : IRequestHandler<GetRecruiterJobsQuery, Result<IReadOnlyList<JobSummaryResponse>>>
{
    private readonly IJobRepository _jobs;

    public GetRecruiterJobsQueryHandler(IJobRepository jobs) => _jobs = jobs;

    public async Task<Result<IReadOnlyList<JobSummaryResponse>>> Handle(GetRecruiterJobsQuery request, CancellationToken cancellationToken)
    {
        var jobs = await _jobs.GetByRecruiterAsync(request.RecruiterProfileId, cancellationToken);
        var dtos = jobs.Select(j => new JobSummaryResponse(
            j.Id, j.Title, j.Description,
            j.JobType, j.WorkMode, j.ExperienceLevel,
            j.MinimumSalary, j.MaximumSalary, j.SalaryCurrency,
            j.Status, j.DeadlineAt, j.CreatedAt,
            j.Recruiter != null ? $"{j.Recruiter.FirstName} {j.Recruiter.LastName}" : string.Empty,
            j.Company?.Name,
            j.Category?.Name,
            j.Location?.City,
            j.Location?.Country)).ToList();

        return Result<IReadOnlyList<JobSummaryResponse>>.Success(dtos);
    }
}
