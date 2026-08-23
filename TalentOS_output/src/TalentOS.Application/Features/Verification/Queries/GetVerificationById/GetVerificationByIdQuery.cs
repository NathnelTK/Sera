using MediatR;
using TalentOS.Application.Features.Verification.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Verification.Queries.GetVerificationById;

public record GetVerificationByIdQuery(Guid VerificationId) : IRequest<Result<VerificationResponse>>;
