using MediatR;
using TalentOS.Application.Abstractions;
using TalentOS.Application.Features.Applications.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Applications.Queries.GetApplicationById;

public sealed class GetApplicationByIdQueryHandler : IRequestHandler<GetApplicationByIdQuery, Result<ApplicationDetailsResponse>>
{
    private readonly IJobApplicationRepository _applications;
    private readonly ICurrentUserService _currentUser;

    public GetApplicationByIdQueryHandler(IJobApplicationRepository applications, ICurrentUserService currentUser)
    {
        _applications = applications;
        _currentUser = currentUser;
    }

    public async Task<Result<ApplicationDetailsResponse>> Handle(GetApplicationByIdQuery request, CancellationToken cancellationToken)
    {
        var application = await _applications.GetWithDetailsAsync(request.ApplicationId, cancellationToken);
        if (application is null) return Result<ApplicationDetailsResponse>.Failure("Application not found.");

        var dto = new ApplicationDetailsResponse(
            application.Id, application.JobId,
            application.Job?.Title ?? string.Empty,
            application.Job?.Company?.Name,
            application.ApplicantProfileId,
            application.ApplicantProfile != null ? $"{application.ApplicantProfile.FirstName} {application.ApplicantProfile.LastName}" : string.Empty,
            application.Status, application.CoverLetter,
            application.MatchScore, application.AiSummary, application.RejectionReason,
            application.ReviewedAt, application.CreatedAt);

        return Result<ApplicationDetailsResponse>.Success(dto);
    }
}
