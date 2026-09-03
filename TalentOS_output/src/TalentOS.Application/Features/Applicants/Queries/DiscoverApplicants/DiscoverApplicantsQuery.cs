using MediatR;
using TalentOS.Application.Common;
using TalentOS.Application.Features.Applicants.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Applicants.Queries.DiscoverApplicants;

public sealed record DiscoverApplicantsQuery(
    PaginationFilter Filter, string? Location = null, string? Skill = null, bool OpenToWorkOnly = true)
    : IRequest<Result<PagedList<ApplicantDiscoveryResponse>>>;
