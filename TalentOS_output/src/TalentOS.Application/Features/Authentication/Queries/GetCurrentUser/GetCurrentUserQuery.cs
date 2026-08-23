using MediatR;
using TalentOS.Application.Features.Authentication.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Authentication.Queries.GetCurrentUser;

public record GetCurrentUserQuery(Guid UserId) : IRequest<Result<CurrentUserDto>>;
