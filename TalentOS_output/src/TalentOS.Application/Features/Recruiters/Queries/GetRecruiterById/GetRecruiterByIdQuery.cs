using MediatR;
using TalentOS.Application.Features.Recruiters.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Recruiters.Queries.GetRecruiterById;

public record GetRecruiterByIdQuery(Guid RecruiterId) : IRequest<Result<RecruiterProfileResponse>>;
