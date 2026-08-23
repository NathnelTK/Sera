using MediatR;
using TalentOS.Application.Features.Verification.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Verification.Queries.GetPendingVerifications;

public record GetPendingVerificationsQuery : IRequest<Result<IReadOnlyList<VerificationResponse>>>;
