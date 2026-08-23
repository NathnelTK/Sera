using MediatR;
using TalentOS.Application.Features.Authentication.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Authentication.Commands.RefreshToken;

public record RefreshTokenCommand(string AccessToken, string RefreshToken) : IRequest<Result<AuthTokensDto>>;
