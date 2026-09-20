using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalentOS.Application.Features.Recruiters.Commands.UpdateProfile;
using TalentOS.Application.Features.Recruiters.DTOs;
using TalentOS.Application.Features.Recruiters.Queries.GetRecruiterById;
using TalentOS.Application.Features.Recruiters.Queries.GetMyRecruiterProfile;

namespace TalentOS.API.Controllers;

public sealed class RecruitersController : BaseApiController
{
    [Authorize(Roles = "Recruiter")]
    [HttpGet("me")]
    public async Task<IActionResult> GetMe(CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        return userId is null ? Unauthorized() : FromResult(await Mediator.Send(new GetMyRecruiterProfileQuery(userId.Value), ct));
    }
    /// <summary>Get a recruiter profile by ID.</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(RecruiterProfileResponse), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await Mediator.Send(new GetRecruiterByIdQuery(id), ct);
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { error = result.Error });
    }

    /// <summary>Update the current user's recruiter profile.</summary>
    [Authorize(Roles = "Recruiter")]
    [HttpPut("{id:guid}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateRecruiterProfileRequest request, CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();

        var command = new UpdateRecruiterProfileCommand(
            userId.Value, request.FirstName, request.LastName,
            request.Title, request.Bio, request.AvatarUrl,
            request.Phone, request.RecruiterType);

        return FromResult(await Mediator.Send(command, ct));
    }

    private Guid? GetCurrentUserId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var id) ? id : null;
    }
}
