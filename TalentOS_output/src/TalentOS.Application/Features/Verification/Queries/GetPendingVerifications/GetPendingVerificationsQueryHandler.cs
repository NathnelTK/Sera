using MediatR;
using TalentOS.Application.Features.Verification.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Verification.Queries.GetPendingVerifications;

public sealed class GetPendingVerificationsQueryHandler : IRequestHandler<GetPendingVerificationsQuery, Result<IReadOnlyList<VerificationResponse>>>
{
    private readonly IVerificationRepository _verifications;

    public GetPendingVerificationsQueryHandler(IVerificationRepository verifications) => _verifications = verifications;

    public async Task<Result<IReadOnlyList<VerificationResponse>>> Handle(GetPendingVerificationsQuery request, CancellationToken cancellationToken)
    {
        var list = await _verifications.GetPendingAsync(cancellationToken);
        var dtos = list.Select(v => new VerificationResponse(v.Id, v.UserId, v.CompanyId, v.VerificationType, v.Status, v.Notes, v.RejectionReason, v.ReviewedAt, v.CreatedAt)).ToList();
        return Result<IReadOnlyList<VerificationResponse>>.Success(dtos);
    }
}
