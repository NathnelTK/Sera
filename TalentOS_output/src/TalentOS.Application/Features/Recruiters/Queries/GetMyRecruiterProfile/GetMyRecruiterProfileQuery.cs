using MediatR;
using TalentOS.Application.Features.Recruiters.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Recruiters.Queries.GetMyRecruiterProfile;

public sealed record GetMyRecruiterProfileQuery(Guid UserId) : IRequest<Result<RecruiterProfileResponse>>;
