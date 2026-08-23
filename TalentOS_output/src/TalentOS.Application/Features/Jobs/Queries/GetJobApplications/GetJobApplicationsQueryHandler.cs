using MediatR;
using TalentOS.Application.Abstractions;
using TalentOS.Application.Features.Jobs.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Jobs.Queries.GetJobApplications;

public sealed class GetJobApplicationsQueryHandler : IRequestHandler<GetJobApplicationsQuery, Result<IReadOnlyList<JobApplicationSummary>>>
{
    private readonly IJobApplicationRepository _applications;
    private readonly IJobRepository _jobs;
    private readonly IRecruiterProfileRepository _recruiters;
    private readonly ICurrentUserService _currentUser;

    public GetJobApplicationsQueryHandler(IJobApplicationRepository applications, IJobRepository jobs, IRecruiterProfileRepository recruiters, ICurrentUserService currentUser)
    {
        _applications = applications;
        _jobs = jobs;
        _recruiters = recruiters;
        _currentUser = currentUser;
    }

    public async Task<Result<IReadOnlyList<JobApplicationSummary>>> Handle(GetJobApplicationsQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId;
        if (userId is null) return Result<IReadOnlyList<JobApplicationSummary>>.Failure("Unauthorized.");

        var job = await _jobs.GetByIdAsync(request.JobId, cancellationToken);
        if (job is null) return Result<IReadOnlyList<JobApplicationSummary>>.Failure("Job not found.");

        var recruiter = await _recruiters.GetByUserIdAsync(userId.Value, cancellationToken);
        if (recruiter is null || job.RecruiterProfileId != recruiter.Id)
            return Result<IReadOnlyList<JobApplicationSummary>>.Failure("You do not have permission to view these applications.");

        var apps = await _applications.GetByJobAsync(request.JobId, cancellationToken);
        var summaries = apps.Select(a => new JobApplicationSummary(
            a.Id, a.ApplicantProfileId,
            a.ApplicantProfile != null ? $"{a.ApplicantProfile.FirstName} {a.ApplicantProfile.LastName}" : string.Empty,
            a.Status, a.CreatedAt, a.MatchScore)).ToList();

        return Result<IReadOnlyList<JobApplicationSummary>>.Success(summaries);
    }
}
