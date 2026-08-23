using MediatR;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Verification.Commands.ApproveVerification;

public record ApproveVerificationCommand(Guid VerificationId, Guid AdminUserId, string? Notes) : IRequest<Result>;
