using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalentOS.Application.Features.Verification.Commands.ApproveVerification;
using TalentOS.Application.Features.Verification.Commands.RejectVerification;
using TalentOS.Application.Features.Verification.Commands.SubmitFaydaVerification;
using TalentOS.Application.Features.Verification.Commands.SubmitVerification;
using TalentOS.Application.Features.Verification.DTOs;
using TalentOS.Application.Features.Verification.Queries.GetPendingVerifications;
using TalentOS.Application.Features.Verification.Queries.GetVerificationById;

namespace TalentOS.API.Controllers;

public sealed class VerificationController : BaseApiController
{
    /// <summary>Submit a new verification request.</summary>
    [Authorize]
    [HttpPost]
    [ProducesResponseType(typeof(Guid), 201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Submit([FromBody] SubmitVerificationRequest request, CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();

        var command = new SubmitVerificationCommand(userId.Value, request.VerificationType, request.Notes);
        var result = await Mediator.Send(command, ct);
        return result.IsSuccess ? CreatedAtRoute("GetVerificationById", new { id = result.Value }, new { id = result.Value }) : BadRequest(new { error = result.Error });
    }

    /// <summary>
    /// Submit a Fayda national-ID scan for identity verification. The client decodes the ID's QR
    /// code and validates its signature on-device (fayda-decoder), then posts the decoded fields.
    /// </summary>
    [Authorize]
    [HttpPost("fayda")]
    [ProducesResponseType(201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> SubmitFayda([FromBody] SubmitFaydaVerificationRequest request, CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();

        var command = new SubmitFaydaVerificationCommand(
            userId.Value,
            request.Fan,
            request.FullName,
            request.DateOfBirth,
            request.Gender,
            request.SignatureVerified,
            request.RawPayloadJson);

        var result = await Mediator.Send(command, ct);
        return result.IsSuccess
            ? CreatedAtRoute("GetVerificationById", new { id = result.Value }, new { id = result.Value })
            : BadRequest(new { error = result.Error });
    }

    /// <summary>Get a verification request by ID.</summary>
    [Authorize]
    [HttpGet("{id:guid}", Name = "GetVerificationById")]
    [ProducesResponseType(typeof(VerificationResponse), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await Mediator.Send(new GetVerificationByIdQuery(id), ct);
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { error = result.Error });
    }

    /// <summary>Get all pending verifications. Admin only.</summary>
    [Authorize(Roles = "Admin")]
    [HttpGet("pending")]
    [ProducesResponseType(typeof(IReadOnlyList<VerificationResponse>), 200)]
    public async Task<IActionResult> GetPending(CancellationToken ct)
        => FromResult(await Mediator.Send(new GetPendingVerificationsQuery(), ct));

    /// <summary>Approve a pending verification. Admin only.</summary>
    [Authorize(Roles = "Admin")]
    [HttpPost("{id:guid}/approve")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Approve(Guid id, [FromBody] ApproveVerificationRequest request, CancellationToken ct)
    {
        var adminId = GetCurrentUserId();
        if (adminId is null) return Unauthorized();
        return FromResult(await Mediator.Send(new ApproveVerificationCommand(id, adminId.Value, request.Notes), ct));
    }

    /// <summary>Reject a pending verification. Admin only.</summary>
    [Authorize(Roles = "Admin")]
    [HttpPost("{id:guid}/reject")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Reject(Guid id, [FromBody] RejectVerificationRequest request, CancellationToken ct)
    {
        var adminId = GetCurrentUserId();
        if (adminId is null) return Unauthorized();
        return FromResult(await Mediator.Send(new RejectVerificationCommand(id, adminId.Value, request.RejectionReason), ct));
    }

    private Guid? GetCurrentUserId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var id) ? id : null;
    }
}
