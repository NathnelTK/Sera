using MediatR;
using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Verification.Commands.ApproveVerification;

public sealed class ApproveVerificationCommandHandler : IRequestHandler<ApproveVerificationCommand, Result>
{
    private readonly IVerificationRepository _verifications;
    private readonly IUnitOfWork _unitOfWork;

    public ApproveVerificationCommandHandler(IVerificationRepository verifications, IUnitOfWork unitOfWork)
    {
        _verifications = verifications;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(ApproveVerificationCommand request, CancellationToken cancellationToken)
    {
        var verification = await _verifications.GetByIdAsync(request.VerificationId, cancellationToken);
        if (verification is null) return Result.Failure("Verification request not found.");
        if (verification.Status != VerificationStatus.Pending)
            return Result.Failure("Only pending verifications can be approved.");

        verification.Status = VerificationStatus.Approved;
        verification.ReviewedAt = DateTime.UtcNow;
        verification.ReviewedBy = request.AdminUserId;
        if (request.Notes is not null) verification.Notes = request.Notes;

        _verifications.Update(verification);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
