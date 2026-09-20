using MediatR;
using TalentOS.Application.Common;
using TalentOS.Application.Features.Applicants.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Applicants.Queries.DiscoverApplicants;

public sealed class DiscoverApplicantsQueryHandler : IRequestHandler<DiscoverApplicantsQuery, Result<PagedList<ApplicantDiscoveryResponse>>>
{
    private readonly IApplicantProfileRepository _applicants;
    public DiscoverApplicantsQueryHandler(IApplicantProfileRepository applicants) => _applicants = applicants;

    public async Task<Result<PagedList<ApplicantDiscoveryResponse>>> Handle(DiscoverApplicantsQuery request, CancellationToken cancellationToken)
    {
        var filter = request.Filter;
        var (profiles, total) = await _applicants.DiscoverAsync(filter.Skip, filter.EffectivePageSize,
            filter.SearchTerm, request.Location, request.Skill, request.OpenToWorkOnly, cancellationToken);
        var result = profiles.Select(a => new ApplicantDiscoveryResponse(
            a.Id, a.FirstName, a.LastName, a.Headline, a.Summary, a.AvatarUrl, a.IsOpenToWork,
            a.Location is null ? null : new LocationDto(a.Location.City, a.Location.Country, a.Location.State, a.Location.PostalCode),
            a.Skills.Select(s => new ApplicantDiscoverySkill(s.Skill.Name, (int)s.Level, s.YearsOfExperience)).ToList(),
            a.Experiences.OrderByDescending(e => e.IsCurrentPosition).ThenByDescending(e => e.StartDate)
                .Select(e => new ApplicantDiscoveryExperience(e.CompanyName, e.Title, e.Description, e.StartDate, e.EndDate, e.IsCurrentPosition)).ToList())).ToList();
        return Result<PagedList<ApplicantDiscoveryResponse>>.Success(new PagedList<ApplicantDiscoveryResponse>(
            result, total, filter.EffectivePageNumber, filter.EffectivePageSize));
    }
}
