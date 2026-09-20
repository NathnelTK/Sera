using MediatR;
using TalentOS.Application.Features.Applicants.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Applicants.Queries.GetRecruiterApplicant;

public sealed record GetRecruiterApplicantQuery(Guid ApplicantId) : IRequest<Result<ApplicantDiscoveryResponse>>;
