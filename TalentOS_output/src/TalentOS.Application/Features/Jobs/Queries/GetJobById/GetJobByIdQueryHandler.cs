using MediatR;
using TalentOS.Application.Features.Jobs.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Jobs.Queries.GetJobById;

public sealed class GetJobByIdQueryHandler : IRequestHandler<GetJobByIdQuery, Result<JobDetailsResponse>>
{
    private readonly IJobRepository _jobs;

    public GetJobByIdQueryHandler(IJobRepository jobs) => _jobs = jobs;

    public async Task<Result<JobDetailsResponse>> Handle(GetJobByIdQuery request, CancellationToken cancellationToken)
    {
        var job = await _jobs.GetWithDetailsAsync(request.JobId, cancellationToken);
        if (job is null) return Result<JobDetailsResponse>.Failure("Job not found.");

        return Result<JobDetailsResponse>.Success(new JobDetailsResponse(
            job.Id, job.Title, job.Description, job.Requirements, job.Benefits,
            job.JobType, job.WorkMode, job.ExperienceLevel,
            job.MinimumSalary, job.MaximumSalary, job.SalaryCurrency,
            job.Status, job.DeadlineAt, job.PublishedAt, job.CreatedAt,
            job.Recruiter != null ? $"{job.Recruiter.FirstName} {job.Recruiter.LastName}" : string.Empty,
            job.RecruiterProfileId,
            job.Company?.Name, job.CompanyId,
            job.Applications.Count));
    }
}
