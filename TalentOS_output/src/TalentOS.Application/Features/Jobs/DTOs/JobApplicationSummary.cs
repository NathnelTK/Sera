using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.Jobs.DTOs;

public sealed record JobApplicationSummary(
    Guid ApplicationId,
    Guid ApplicantProfileId,
    string ApplicantName,
    ApplicationStatus Status,
    DateTime AppliedAt,
    double? MatchScore,
    string? MatchExplanation,
    double? SkillsMatch,
    double? ExperienceMatch,
    double? EducationMatch,
    double? RequirementsMatch,
    double? LocationMatch
);
