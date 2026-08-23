using System.Text.Json;
using MediatR;
using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;
using TalentOS.Domain.Interfaces;
using DomainVerification = TalentOS.Domain.Entities.Verification;

namespace TalentOS.Application.Features.Verification.Commands.SubmitFaydaVerification;

public sealed class SubmitFaydaVerificationCommandHandler : IRequestHandler<SubmitFaydaVerificationCommand, Result<Guid>>
{
    private readonly IVerificationRepository _verifications;
    private readonly IUnitOfWork _unitOfWork;

    public SubmitFaydaVerificationCommandHandler(IVerificationRepository verifications, IUnitOfWork unitOfWork)
    {
        _verifications = verifications;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Guid>> Handle(SubmitFaydaVerificationCommand request, CancellationToken cancellationToken)
    {
        var existingForType = await _verifications.FindAsync(
            v => v.UserId == request.UserId && v.VerificationType == VerificationType.FiydaId,
            cancellationToken);

        var latest = existingForType
            .OrderByDescending(v => v.CreatedAt)
            .FirstOrDefault();

        if (latest is { Status: VerificationStatus.Approved })
            return Result<Guid>.Failure("Your Fayda identity has already been verified.");

        var payload = request.RawPayloadJson ?? JsonSerializer.Serialize(new
        {
            fan = request.Fan,
            fullName = request.FullName,
            dateOfBirth = request.DateOfBirth,
            gender = request.Gender
        });

        // Placeholder trust model: the on-device decoder reports whether the card's JWS signature
        // validated. When it did, we auto-approve; otherwise the request awaits manual admin review.
        var status = request.SignatureVerified ? VerificationStatus.Approved : VerificationStatus.Pending;
        var notes = $"Fayda verification for {request.FullName}".Trim();

        // Reuse a prior non-approved attempt so retries don't accumulate duplicate rows.
        if (latest is not null)
        {
            latest.ReferenceNumber = request.Fan;
            latest.DecodedPayloadJson = payload;
            latest.SignatureVerified = request.SignatureVerified;
            latest.Status = status;
            latest.Notes = notes;
            latest.RejectionReason = null;
            latest.ReviewedAt = request.SignatureVerified ? DateTime.UtcNow : null;

            _verifications.Update(latest);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result<Guid>.Success(latest.Id);
        }

        var verification = new DomainVerification
        {
            UserId = request.UserId,
            VerificationType = VerificationType.FiydaId,
            Status = status,
            ReferenceNumber = request.Fan,
            DecodedPayloadJson = payload,
            SignatureVerified = request.SignatureVerified,
            Notes = notes,
            ReviewedAt = request.SignatureVerified ? DateTime.UtcNow : null
        };

        _verifications.Add(verification);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result<Guid>.Success(verification.Id);
    }
}
