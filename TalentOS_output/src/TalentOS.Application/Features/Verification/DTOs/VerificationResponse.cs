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
    DateTime SubmittedAt,
    string? ReferenceNumber,
    bool SignatureVerified
);

public sealed record SubmitVerificationRequest(VerificationType VerificationType, string? Notes);
public sealed record ApproveVerificationRequest(string? Notes);
public sealed record RejectVerificationRequest(string RejectionReason);

/// <summary>
/// Payload for a Fayda national-ID verification. The client decodes the ID's QR code with the
/// fayda-decoder library and validates its signature on-device, then submits the decoded fields.
/// </summary>
public sealed record SubmitFaydaVerificationRequest(
    string Fan,
    string FullName,
    string? DateOfBirth,
    string? Gender,
    bool SignatureVerified,
    string? RawPayloadJson);
