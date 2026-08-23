using MediatR;
using TalentOS.Application.Features.Verification.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Verification.Queries.GetVerificationById;

public sealed class GetVerificationByIdQueryHandler : IRequestHandler<GetVerificationByIdQuery, Result<VerificationResponse>>
{
    private readonly IVerificationRepository _verifications;

    public GetVerificationByIdQueryHandler(IVerificationRepository verifications) => _verifications = verifications;

    public async Task<Result<VerificationResponse>> Handle(GetVerificationByIdQuery request, CancellationToken cancellationToken)
    {
        var v = await _verifications.GetByIdAsync(request.VerificationId, cancellationToken);
        if (v is null) return Result<VerificationResponse>.Failure("Verification request not found.");

        return Result<VerificationResponse>.Success(new VerificationResponse(v.Id, v.UserId, v.CompanyId, v.VerificationType, v.Status, v.Notes, v.RejectionReason, v.ReviewedAt, v.CreatedAt, v.ReferenceNumber, v.SignatureVerified));
    }
}
