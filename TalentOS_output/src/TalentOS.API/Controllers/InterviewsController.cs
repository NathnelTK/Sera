using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalentOS.Application.Features.Interviews.Commands.CancelInterview;
using TalentOS.Application.Features.Interviews.Commands.ScheduleInterview;
using TalentOS.Application.Features.Interviews.Commands.UpdateInterview;
using TalentOS.Application.Features.Interviews.DTOs;
using TalentOS.Application.Features.Interviews.Queries.GetInterviewById;
using TalentOS.Application.Features.Interviews.Queries.GetMyInterviews;

namespace TalentOS.API.Controllers;

public sealed class InterviewsController : BaseApiController
{
    /// <summary>Schedule an interview for an application. Recruiter only.</summary>
    [Authorize(Roles = "Recruiter")]
    [HttpPost]
    [ProducesResponseType(typeof(Guid), 201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Schedule([FromBody] ScheduleInterviewRequest request, CancellationToken ct)
    {
        var command = new ScheduleInterviewCommand(request.JobApplicationId, request.Format, request.ScheduledAt, request.DurationMinutes, request.MeetingLink, request.LocationDescription, request.Notes);
        var result = await Mediator.Send(command, ct);
        return result.IsSuccess ? CreatedAtRoute("GetInterviewById", new { id = result.Value }, new { id = result.Value }) : BadRequest(new { error = result.Error });
    }

    /// <summary>Get interview by ID.</summary>
    [Authorize]
    [HttpGet("{id:guid}", Name = "GetInterviewById")]
    [ProducesResponseType(typeof(InterviewResponse), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await Mediator.Send(new GetInterviewByIdQuery(id), ct);
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { error = result.Error });
    }

    /// <summary>Update/reschedule an interview. Recruiter only.</summary>
    [Authorize(Roles = "Recruiter")]
    [HttpPut("{id:guid}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateInterviewRequest request, CancellationToken ct)
    {
        var command = new UpdateInterviewCommand(id, request.Format, request.ScheduledAt, request.DurationMinutes, request.MeetingLink, request.LocationDescription, request.Notes);
        return FromResult(await Mediator.Send(command, ct));
    }

    /// <summary>Cancel an interview. Recruiter only.</summary>
    [Authorize(Roles = "Recruiter")]
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Cancel(Guid id, [FromQuery] string? reason, CancellationToken ct)
        => FromResult(await Mediator.Send(new CancelInterviewCommand(id, reason), ct));

    /// <summary>Get interviews for the current user (recruiter or applicant).</summary>
    [Authorize]
    [HttpGet("my")]
    [ProducesResponseType(typeof(IReadOnlyList<InterviewResponse>), 200)]
    public async Task<IActionResult> GetMine(CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();
        var isRecruiter = User.IsInRole("Recruiter");
        return FromResult(await Mediator.Send(new GetMyInterviewsQuery(userId.Value, isRecruiter), ct));
    }

    private Guid? GetCurrentUserId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var id) ? id : null;
    }
}
