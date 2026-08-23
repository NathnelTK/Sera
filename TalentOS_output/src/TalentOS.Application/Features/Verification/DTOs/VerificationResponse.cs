using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.Verification.DTOs;

public sealed record VerificationResponse(
    Guid Id,
    Guid UserId,
    Guid? CompanyId,
    VerificationType VerificationType,
    VerificationStatus Status,
    string? Notes,
    string? RejectionReason,
    DateTime? ReviewedAt,
    DateTime SubmittedAt
);

public sealed record SubmitVerificationRequest(VerificationType VerificationType, string? Notes);
public sealed record ApproveVerificationRequest(string? Notes);
public sealed record RejectVerificationRequest(string RejectionReason);
