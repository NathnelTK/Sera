using MediatR;
using TalentOS.Application.Features.Applicants.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Applicants.Queries.GetApplicantById;

public sealed class GetApplicantByIdQueryHandler : IRequestHandler<GetApplicantByIdQuery, Result<ApplicantProfileResponse>>
{
    private readonly IApplicantProfileRepository _applicants;

    public GetApplicantByIdQueryHandler(IApplicantProfileRepository applicants) => _applicants = applicants;

    public async Task<Result<ApplicantProfileResponse>> Handle(GetApplicantByIdQuery request, CancellationToken cancellationToken)
    {
        var profile = await _applicants.GetWithFullDetailsAsync(request.ApplicantId, cancellationToken);
        if (profile is null) return Result<ApplicantProfileResponse>.Failure("Applicant profile not found.");

        var dto = new ApplicantProfileResponse(
            profile.Id, profile.UserId,
            profile.User?.Email ?? string.Empty,
            profile.FirstName, profile.LastName,
            profile.Headline, profile.Summary, profile.Phone,
            profile.AvatarUrl, profile.LinkedInUrl, profile.GitHubUrl, profile.PortfolioUrl,
            profile.IsOpenToWork,
            profile.Location != null ? new LocationDto(profile.Location.City, profile.Location.Country, profile.Location.State, profile.Location.PostalCode) : null,
            profile.Skills.Select(s => new ApplicantSkillResponse(s.SkillId, s.Skill.Name, s.Level, s.YearsOfExperience)).ToList(),
            profile.Educations.Select(e => new EducationResponse(e.Id, e.Institution, e.Degree, e.FieldOfStudy, e.Grade, e.Description, e.StartYear, e.EndYear, e.IsOngoing)).ToList(),
            profile.Experiences.Select(e => new ExperienceResponse(e.Id, e.CompanyName, e.Title, e.Description, e.EmploymentType, e.LocationDescription, e.StartDate, e.EndDate, e.IsCurrentPosition)).ToList(),
            profile.CreatedAt, profile.UpdatedAt);

        return Result<ApplicantProfileResponse>.Success(dto);
    }
}
