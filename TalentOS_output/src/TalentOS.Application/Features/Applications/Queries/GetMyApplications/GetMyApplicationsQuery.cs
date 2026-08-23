using MediatR;
using TalentOS.Application.Features.Applications.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Applications.Queries.GetMyApplications;

public record GetMyApplicationsQuery(Guid UserId) : IRequest<Result<IReadOnlyList<ApplicationSummaryResponse>>>;
