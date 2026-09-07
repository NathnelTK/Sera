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
        var summaries = apps.Select(a => {
            var score = a.MatchScore;
            var skills = score.HasValue ? Math.Min(1d, score.Value + 0.05d) : (double?)null;
            var experience = score.HasValue ? Math.Max(0d, score.Value - 0.03d) : (double?)null;
            var education = score.HasValue ? Math.Max(0d, score.Value - 0.01d) : (double?)null;
            var requirements = score.HasValue ? score.Value : (double?)null;
            var location = score.HasValue ? Math.Max(0d, score.Value - 0.07d) : (double?)null;
            return new JobApplicationSummary(
            a.Id, a.ApplicantProfileId,
            a.ApplicantProfile != null ? $"{a.ApplicantProfile.FirstName} {a.ApplicantProfile.LastName}" : string.Empty,
            a.Status, a.CreatedAt, score, a.AiSummary,
            skills, experience, education, requirements, location);
        }).ToList();

        return Result<IReadOnlyList<JobApplicationSummary>>.Success(summaries);
    }
}
