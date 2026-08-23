using MediatR;
using TalentOS.Application.Features.Applicants.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Applicants.Queries.GetApplicantSkills;

public sealed class GetApplicantSkillsQueryHandler : IRequestHandler<GetApplicantSkillsQuery, Result<IReadOnlyList<ApplicantSkillResponse>>>
{
    private readonly IApplicantProfileRepository _applicants;

    public GetApplicantSkillsQueryHandler(IApplicantProfileRepository applicants) => _applicants = applicants;

    public async Task<Result<IReadOnlyList<ApplicantSkillResponse>>> Handle(GetApplicantSkillsQuery request, CancellationToken cancellationToken)
    {
        var profile = await _applicants.GetWithFullDetailsAsync(request.ApplicantId, cancellationToken);
        if (profile is null) return Result<IReadOnlyList<ApplicantSkillResponse>>.Failure("Applicant profile not found.");

        var skills = profile.Skills
            .Select(s => new ApplicantSkillResponse(s.SkillId, s.Skill?.Name ?? string.Empty, s.Level, s.YearsOfExperience))
            .ToList();

        return Result<IReadOnlyList<ApplicantSkillResponse>>.Success(skills);
    }
}
