using System.Security.Claims;
using MediatR;
using Microsoft.Extensions.Logging;
using TalentOS.Application.Abstractions;
using TalentOS.Application.Features.Authentication.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Authentication.Commands.RefreshToken;

public sealed class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, Result<AuthTokensDto>>
{
    private readonly IUserRepository _users;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITokenService _tokenService;
    private readonly ILogger<RefreshTokenCommandHandler> _logger;
    private static readonly TimeSpan RefreshTokenLifetime = TimeSpan.FromDays(7);

    public RefreshTokenCommandHandler(IUserRepository users, IUnitOfWork unitOfWork, ITokenService tokenService, ILogger<RefreshTokenCommandHandler> logger)
    {
        _users = users;
        _unitOfWork = unitOfWork;
        _tokenService = tokenService;
        _logger = logger;
    }

    public async Task<Result<AuthTokensDto>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        ClaimsPrincipal principal;
        try { principal = _tokenService.GetPrincipalFromExpiredToken(request.AccessToken); }
        catch { return Result<AuthTokensDto>.Failure("Invalid access token."); }

        var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim is null || !Guid.TryParse(userIdClaim, out var userId))
            return Result<AuthTokensDto>.Failure("Invalid token.");

        var user = await _users.GetByIdAsync(userId, cancellationToken);
        if (user is null || user.RefreshToken != request.RefreshToken || user.RefreshTokenExpiresAt <= DateTime.UtcNow)
        {
            _logger.LogWarning("Refresh failed — invalid or expired refresh token for user: {UserId}", userId);
            return Result<AuthTokensDto>.Failure("Invalid or expired refresh token.");
        }

        var newAccessToken = _tokenService.GenerateAccessToken(user);
        var newRefreshToken = _tokenService.GenerateRefreshToken();
        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiresAt = DateTime.UtcNow.Add(RefreshTokenLifetime);
        _users.Update(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<AuthTokensDto>.Success(new AuthTokensDto(newAccessToken, newRefreshToken, DateTime.UtcNow.AddMinutes(15)));
    }
}
