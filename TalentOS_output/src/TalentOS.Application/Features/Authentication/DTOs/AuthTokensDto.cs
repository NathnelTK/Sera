namespace TalentOS.Application.Features.Authentication.DTOs;

public sealed record AuthTokensDto(string AccessToken, string RefreshToken, DateTime ExpiresAt);
