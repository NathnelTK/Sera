using MediatR;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Verification.Commands.SubmitFaydaVerification;

/// <summary>
/// Records the result of a client-side Fayda national-ID scan. The QR code is decoded and its
/// signature validated on-device by the fayda-decoder library; this command persists the decoded
/// fields together with the signature outcome.
/// </summary>
/// <remarks>
/// Placeholder trust model: server-side we currently trust the client's <c>SignatureVerified</c>
/// flag. Before production, the detached JWS signature must be re-verified server-side against
/// NIDP's published public key.
/// </remarks>
public sealed record SubmitFaydaVerificationCommand(
    Guid UserId,
    string Fan,
    string FullName,
    string? DateOfBirth,
    string? Gender,
    bool SignatureVerified,
    string? RawPayloadJson) : IRequest<Result<Guid>>;
