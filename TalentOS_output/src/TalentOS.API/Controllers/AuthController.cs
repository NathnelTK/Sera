using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalentOS.Application.Features.Authentication.Commands.Login;
using TalentOS.Application.Features.Authentication.Commands.Logout;
using TalentOS.Application.Features.Authentication.Commands.RefreshToken;
using TalentOS.Application.Features.Authentication.Commands.Register;
using TalentOS.Application.Features.Authentication.DTOs;
using TalentOS.Application.Features.Authentication.Queries.GetCurrentUser;
using TalentOS.Domain.Common;

namespace TalentOS.API.Controllers;

public sealed class AuthController : BaseApiController
{
    /// <summary>Register a new user account (Applicant or Recruiter).</summary>
    [HttpPost("register")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command, CancellationToken ct)
        => FromResult(await Mediator.Send(command, ct));

    /// <summary>Authenticate and receive JWT tokens.</summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthTokensDto), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Login([FromBody] LoginCommand command, CancellationToken ct)
        => FromResult(await Mediator.Send(command, ct));

    /// <summary>Refresh an expired access token using a refresh token.</summary>
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(AuthTokensDto), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenCommand command, CancellationToken ct)
        => FromResult(await Mediator.Send(command, ct));

    /// <summary>Revoke the current user's refresh token (logout).</summary>
    [Authorize]
    [HttpPost("logout")]
    [ProducesResponseType(204)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> Logout(CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();
        return FromResult(await Mediator.Send(new LogoutCommand(userId.Value), ct));
    }

    /// <summary>Get the current authenticated user's information.</summary>
    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(typeof(CurrentUserDto), 200)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> Me(CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();
        return FromResult(await Mediator.Send(new GetCurrentUserQuery(userId.Value), ct));
    }

    private Guid? GetCurrentUserId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var id) ? id : null;
    }
}
