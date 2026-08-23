using MediatR;
using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.Verification.Commands.SubmitVerification;

public record SubmitVerificationCommand(Guid UserId, VerificationType VerificationType, string? Notes) : IRequest<Result<Guid>>;
