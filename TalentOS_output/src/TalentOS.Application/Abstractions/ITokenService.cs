using System.Security.Claims;
using TalentOS.Domain.Entities;

namespace TalentOS.Application.Abstractions;

public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
}
