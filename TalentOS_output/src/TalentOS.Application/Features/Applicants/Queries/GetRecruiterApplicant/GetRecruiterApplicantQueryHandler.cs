using MediatR;
using TalentOS.Application.Features.Applicants.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Applicants.Queries.GetRecruiterApplicant;

public sealed class GetRecruiterApplicantQueryHandler : IRequestHandler<GetRecruiterApplicantQuery, Result<ApplicantDiscoveryResponse>>
{
    private readonly IApplicantProfileRepository _applicants;
    public GetRecruiterApplicantQueryHandler(IApplicantProfileRepository applicants) => _applicants = applicants;

    public async Task<Result<ApplicantDiscoveryResponse>> Handle(GetRecruiterApplicantQuery request, CancellationToken cancellationToken)
    {
        var a = await _applicants.GetWithFullDetailsAsync(request.ApplicantId, cancellationToken);
        if (a is null || a.User is null || !a.User.IsActive) return Result<ApplicantDiscoveryResponse>.Failure("Applicant profile not found.");
        return Result<ApplicantDiscoveryResponse>.Success(new ApplicantDiscoveryResponse(
            a.Id, a.FirstName, a.LastName, a.Headline, a.Summary, a.AvatarUrl, a.IsOpenToWork,
            a.Location is null ? null : new LocationDto(a.Location.City, a.Location.Country, a.Location.State, a.Location.PostalCode),
            a.Skills.Select(s => new ApplicantDiscoverySkill(s.Skill.Name, (int)s.Level, s.YearsOfExperience)).ToList(),
            a.Experiences.OrderByDescending(e => e.IsCurrentPosition).ThenByDescending(e => e.StartDate)
                .Select(e => new ApplicantDiscoveryExperience(e.CompanyName, e.Title, e.Description, e.StartDate, e.EndDate, e.IsCurrentPosition)).ToList()));
    }
}
