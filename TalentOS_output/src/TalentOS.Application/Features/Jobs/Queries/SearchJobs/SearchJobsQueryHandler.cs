using MediatR;
using TalentOS.Application.Common;
using TalentOS.Application.Features.Jobs.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Jobs.Queries.SearchJobs;

public sealed class SearchJobsQueryHandler : IRequestHandler<SearchJobsQuery, Result<PagedList<JobSummaryResponse>>>
{
    private readonly IJobRepository _jobs;

    public SearchJobsQueryHandler(IJobRepository jobs) => _jobs = jobs;

    public async Task<Result<PagedList<JobSummaryResponse>>> Handle(SearchJobsQuery request, CancellationToken cancellationToken)
    {
        var filter = request.Filter;
        var (jobs, totalCount) = await _jobs.GetPublishedAsync(filter.Skip, filter.EffectivePageSize, filter.SearchTerm, filter.SortBy, cancellationToken);

        var dtos = jobs.Select(j => new JobSummaryResponse(
            j.Id, j.Title, j.Description,
            j.JobType, j.WorkMode, j.ExperienceLevel,
            j.MinimumSalary, j.MaximumSalary, j.SalaryCurrency,
            j.Status, j.DeadlineAt, j.CreatedAt,
            j.Recruiter != null ? $"{j.Recruiter.FirstName} {j.Recruiter.LastName}" : string.Empty,
            j.Company?.Name)).ToList();

        return Result<PagedList<JobSummaryResponse>>.Success(new PagedList<JobSummaryResponse>(dtos, totalCount, filter.EffectivePageNumber, filter.EffectivePageSize));
    }
}
