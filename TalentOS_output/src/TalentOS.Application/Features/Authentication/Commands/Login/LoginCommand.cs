using MediatR;
using TalentOS.Application.Features.Authentication.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Authentication.Commands.Login;

public record LoginCommand(string Email, string Password) : IRequest<Result<AuthTokensDto>>;
