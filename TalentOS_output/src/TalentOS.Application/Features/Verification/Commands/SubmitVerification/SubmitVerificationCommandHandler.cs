using MediatR;
using TalentOS.Domain.Common;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Enums;
using TalentOS.Domain.Interfaces;
using DomainVerification = TalentOS.Domain.Entities.Verification;

namespace TalentOS.Application.Features.Verification.Commands.SubmitVerification;

public sealed class SubmitVerificationCommandHandler : IRequestHandler<SubmitVerificationCommand, Result<Guid>>
{
    private readonly IVerificationRepository _verifications;
    private readonly IUnitOfWork _unitOfWork;

    public SubmitVerificationCommandHandler(IVerificationRepository verifications, IUnitOfWork unitOfWork)
    {
        _verifications = verifications;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Guid>> Handle(SubmitVerificationCommand request, CancellationToken cancellationToken)
    {
        var existing = await _verifications.FindAsync(
            v => v.UserId == request.UserId && v.VerificationType == request.VerificationType && v.Status == VerificationStatus.Pending,
            cancellationToken);

        if (existing.Count > 0)
            return Result<Guid>.Failure("A pending verification of this type already exists.");

        var verification = new DomainVerification
        {
            UserId = request.UserId,
            VerificationType = request.VerificationType,
            Notes = request.Notes
        };

        _verifications.Add(verification);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result<Guid>.Success(verification.Id);
    }
}
