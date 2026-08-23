using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalentOS.Application.Features.Applicants.Commands.UpdateProfile;
using TalentOS.Application.Features.Applicants.DTOs;
using TalentOS.Application.Features.Applicants.Queries.GetApplicantById;
using TalentOS.Application.Features.Applicants.Queries.GetApplicantSkills;

namespace TalentOS.API.Controllers;

public sealed class ApplicantsController : BaseApiController
{
    /// <summary>Get an applicant profile by ID.</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApplicantProfileResponse), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await Mediator.Send(new GetApplicantByIdQuery(id), ct);
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { error = result.Error });
    }

    /// <summary>Update the current user's applicant profile.</summary>
    [Authorize(Roles = "Applicant")]
    [HttpPut("{id:guid}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    [ProducesResponseType(403)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateApplicantProfileRequest request, CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();

        var command = new UpdateApplicantProfileCommand(
            userId.Value, request.FirstName, request.LastName,
            request.Headline, request.Summary, request.Phone,
            request.AvatarUrl, request.LinkedInUrl, request.GitHubUrl,
            request.PortfolioUrl, request.IsOpenToWork);

        return FromResult(await Mediator.Send(command, ct));
    }

    /// <summary>Get skills for an applicant.</summary>
    [HttpGet("{id:guid}/skills")]
    [ProducesResponseType(typeof(IReadOnlyList<ApplicantSkillResponse>), 200)]
    public async Task<IActionResult> GetSkills(Guid id, CancellationToken ct)
        => FromResult(await Mediator.Send(new GetApplicantSkillsQuery(id), ct));

    private Guid? GetCurrentUserId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var id) ? id : null;
    }
}
