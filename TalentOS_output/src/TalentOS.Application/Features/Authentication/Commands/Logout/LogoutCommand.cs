using MediatR;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Authentication.Commands.Logout;

public record LogoutCommand(Guid UserId) : IRequest<Result>;
