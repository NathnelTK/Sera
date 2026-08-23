using MediatR;
using TalentOS.Application.Features.Applications.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Applications.Queries.GetMyApplications;

public sealed class GetMyApplicationsQueryHandler : IRequestHandler<GetMyApplicationsQuery, Result<IReadOnlyList<ApplicationSummaryResponse>>>
{
    private readonly IJobApplicationRepository _applications;
    private readonly IApplicantProfileRepository _applicants;

    public GetMyApplicationsQueryHandler(IJobApplicationRepository applications, IApplicantProfileRepository applicants)
    {
        _applications = applications;
        _applicants = applicants;
    }

    public async Task<Result<IReadOnlyList<ApplicationSummaryResponse>>> Handle(GetMyApplicationsQuery request, CancellationToken cancellationToken)
    {
        var profile = await _applicants.GetByUserIdAsync(request.UserId, cancellationToken);
        if (profile is null) return Result<IReadOnlyList<ApplicationSummaryResponse>>.Failure("Applicant profile not found.");

        var apps = await _applications.GetByApplicantAsync(profile.Id, cancellationToken);
        var summaries = apps.Select(a => new ApplicationSummaryResponse(
            a.Id, a.JobId,
            a.Job?.Title ?? string.Empty,
            a.Job?.Company?.Name,
            a.Status, a.CreatedAt)).ToList();

        return Result<IReadOnlyList<ApplicationSummaryResponse>>.Success(summaries);
    }
}
