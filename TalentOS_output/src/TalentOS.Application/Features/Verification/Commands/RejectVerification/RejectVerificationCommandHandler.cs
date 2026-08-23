using MediatR;
using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Verification.Commands.RejectVerification;

public sealed class RejectVerificationCommandHandler : IRequestHandler<RejectVerificationCommand, Result>
{
    private readonly IVerificationRepository _verifications;
    private readonly IUnitOfWork _unitOfWork;

    public RejectVerificationCommandHandler(IVerificationRepository verifications, IUnitOfWork unitOfWork)
    {
        _verifications = verifications;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(RejectVerificationCommand request, CancellationToken cancellationToken)
    {
        var verification = await _verifications.GetByIdAsync(request.VerificationId, cancellationToken);
        if (verification is null) return Result.Failure("Verification request not found.");
        if (verification.Status != VerificationStatus.Pending)
            return Result.Failure("Only pending verifications can be rejected.");

        verification.Status = VerificationStatus.Rejected;
        verification.RejectionReason = request.RejectionReason;
        verification.ReviewedAt = DateTime.UtcNow;
        verification.ReviewedBy = request.AdminUserId;

        _verifications.Update(verification);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
