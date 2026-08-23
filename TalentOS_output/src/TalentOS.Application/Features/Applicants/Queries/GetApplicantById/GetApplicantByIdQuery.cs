using MediatR;
using TalentOS.Application.Features.Applicants.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Applicants.Queries.GetApplicantById;

public record GetApplicantByIdQuery(Guid ApplicantId) : IRequest<Result<ApplicantProfileResponse>>;
