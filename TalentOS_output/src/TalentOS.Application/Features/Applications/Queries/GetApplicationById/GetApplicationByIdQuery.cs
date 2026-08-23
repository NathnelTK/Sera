using MediatR;
using TalentOS.Application.Features.Applications.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Applications.Queries.GetApplicationById;

public record GetApplicationByIdQuery(Guid ApplicationId) : IRequest<Result<ApplicationDetailsResponse>>;
