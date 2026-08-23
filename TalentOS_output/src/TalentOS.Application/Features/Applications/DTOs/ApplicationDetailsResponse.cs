using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.Applications.DTOs;

public sealed record ApplicationDetailsResponse(
    Guid Id,
    Guid JobId,
    string JobTitle,
    string? CompanyName,
    Guid ApplicantProfileId,
    string ApplicantName,
    ApplicationStatus Status,
    string? CoverLetter,
    double? MatchScore,
    string? AiSummary,
    string? RejectionReason,
    DateTime? ReviewedAt,
    DateTime AppliedAt
);

public sealed record ApplicationSummaryResponse(
    Guid Id,
    Guid JobId,
    string JobTitle,
    string? CompanyName,
    ApplicationStatus Status,
    DateTime AppliedAt
);
