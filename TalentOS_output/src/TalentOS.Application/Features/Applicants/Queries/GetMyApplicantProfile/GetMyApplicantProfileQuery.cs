using MediatR;
using TalentOS.Application.Features.Applicants.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Applicants.Queries.GetMyApplicantProfile;

public sealed record GetMyApplicantProfileQuery(Guid UserId) : IRequest<Result<ApplicantProfileResponse>>;
