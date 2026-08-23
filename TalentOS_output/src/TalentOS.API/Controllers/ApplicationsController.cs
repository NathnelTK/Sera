using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalentOS.Application.Features.Applications.Commands.ApplyForJob;
using TalentOS.Application.Features.Applications.Commands.UpdateApplicationStatus;
using TalentOS.Application.Features.Applications.Commands.WithdrawApplication;
using TalentOS.Application.Features.Applications.DTOs;
using TalentOS.Application.Features.Applications.Queries.GetApplicationById;
using TalentOS.Application.Features.Applications.Queries.GetMyApplications;

namespace TalentOS.API.Controllers;

public sealed class ApplicationsController : BaseApiController
{
    /// <summary>Apply for a job. Applicant only.</summary>
    [Authorize(Roles = "Applicant")]
    [HttpPost]
    [ProducesResponseType(typeof(Guid), 201)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> Apply([FromBody] ApplyForJobCommand command, CancellationToken ct)
    {
        var result = await Mediator.Send(command, ct);
        return result.IsSuccess ? CreatedAtRoute("GetApplicationById", new { id = result.Value }, new { id = result.Value }) : BadRequest(new { error = result.Error });
    }

    /// <summary>Get application details by ID.</summary>
    [Authorize]
    [HttpGet("{id:guid}", Name = "GetApplicationById")]
    [ProducesResponseType(typeof(ApplicationDetailsResponse), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await Mediator.Send(new GetApplicationByIdQuery(id), ct);
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { error = result.Error });
    }

    /// <summary>Get all applications submitted by the current applicant.</summary>
    [Authorize(Roles = "Applicant")]
    [HttpGet("my")]
    [ProducesResponseType(typeof(IReadOnlyList<ApplicationSummaryResponse>), 200)]
    public async Task<IActionResult> GetMine(CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();
        return FromResult(await Mediator.Send(new GetMyApplicationsQuery(userId.Value), ct));
    }

    /// <summary>Update application status. Recruiter only.</summary>
    [Authorize(Roles = "Recruiter")]
    [HttpPut("{id:guid}/status")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateApplicationStatusRequest request, CancellationToken ct)
    {
        var command = new UpdateApplicationStatusCommand(id, request.Status, request.RejectionReason);
        return FromResult(await Mediator.Send(command, ct));
    }

    /// <summary>Withdraw an application. Applicant only.</summary>
    [Authorize(Roles = "Applicant")]
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Withdraw(Guid id, CancellationToken ct)
        => FromResult(await Mediator.Send(new WithdrawApplicationCommand(id), ct));

    private Guid? GetCurrentUserId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var id) ? id : null;
    }
}
