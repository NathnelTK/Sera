using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalentOS.Application.Features.SavedJobs.Commands.SaveJob;
using TalentOS.Application.Features.SavedJobs.Commands.UnsaveJob;
using TalentOS.Application.Features.SavedJobs.Queries.GetMySavedJobs;
using TalentOS.Application.Features.SavedJobs.DTOs;

namespace TalentOS.API.Controllers;

[Authorize(Roles = "Applicant")]
public sealed class SavedJobsController : BaseApiController
{
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<SavedJobResponse>), 200)]
    public async Task<IActionResult> GetMine(CancellationToken ct)
    {
        var userId = GetCurrentUserId(); if (userId is null) return Unauthorized();
        return FromResult(await Mediator.Send(new GetMySavedJobsQuery(userId.Value), ct));
    }

    [HttpPost("{jobId:guid}")]
    public async Task<IActionResult> Save(Guid jobId, CancellationToken ct)
    {
        var userId = GetCurrentUserId(); if (userId is null) return Unauthorized();
        return FromResult(await Mediator.Send(new SaveJobCommand(userId.Value, jobId), ct));
    }

    [HttpDelete("{jobId:guid}")]
    public async Task<IActionResult> Remove(Guid jobId, CancellationToken ct)
    {
        var userId = GetCurrentUserId(); if (userId is null) return Unauthorized();
        return FromResult(await Mediator.Send(new UnsaveJobCommand(userId.Value, jobId), ct));
    }

    private Guid? GetCurrentUserId() { var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value; return Guid.TryParse(claim, out var id) ? id : null; }
}
