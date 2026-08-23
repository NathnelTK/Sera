using MediatR;
using Microsoft.Extensions.Logging;
using TalentOS.Application.Abstractions;
using TalentOS.Application.Features.Authentication.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Authentication.Commands.Login;

public sealed class LoginCommandHandler : IRequestHandler<LoginCommand, Result<AuthTokensDto>>
{
    private readonly IUserRepository _users;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITokenService _tokenService;
    private readonly ILogger<LoginCommandHandler> _logger;
    private static readonly TimeSpan RefreshTokenLifetime = TimeSpan.FromDays(7);

    public LoginCommandHandler(IUserRepository users, IUnitOfWork unitOfWork, ITokenService tokenService, ILogger<LoginCommandHandler> logger)
    {
        _users = users;
        _unitOfWork = unitOfWork;
        _tokenService = tokenService;
        _logger = logger;
    }

    public async Task<Result<AuthTokensDto>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _users.GetByEmailAsync(request.Email, cancellationToken);
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            _logger.LogWarning("Login failed for: {Email}", request.Email);
            return Result<AuthTokensDto>.Failure("Invalid email or password.");
        }

        if (!user.IsActive)
            return Result<AuthTokensDto>.Failure("Account is disabled. Please contact support.");

        var accessToken = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();
        var expiresAt = DateTime.UtcNow.AddMinutes(15);

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiresAt = DateTime.UtcNow.Add(RefreshTokenLifetime);
        _users.Update(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Login successful for user: {UserId}", user.Id);
        return Result<AuthTokensDto>.Success(new AuthTokensDto(accessToken, refreshToken, expiresAt));
    }
}
