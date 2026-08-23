using MediatR;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Verification.Commands.RejectVerification;

public record RejectVerificationCommand(Guid VerificationId, Guid AdminUserId, string RejectionReason) : IRequest<Result>;
