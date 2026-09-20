using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalentOS.Application.Features.Documents.Commands.DeleteDocument;
using TalentOS.Application.Features.Documents.Commands.UploadDocument;
using TalentOS.Application.Features.Documents.DTOs;
using TalentOS.Application.Features.Documents.Queries.GetDocumentById;
using TalentOS.Application.Features.Documents.Queries.GetMyDocuments;
using TalentOS.Domain.Enums;

namespace TalentOS.API.Controllers;

public sealed class DocumentsController : BaseApiController
{
    /// <summary>Upload a document (CV, certificate, etc.). Applicant only.</summary>
    [Authorize(Roles = "Applicant")]
    [HttpPost]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(Guid), 201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Upload(
        IFormFile file,
        [FromForm] DocumentType documentType,
        [FromForm] string? description,
        CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();

        if (file is null || file.Length == 0) return BadRequest(new { error = "No file provided." });

        using var stream = file.OpenReadStream();
        var command = new UploadDocumentCommand(userId.Value, null, stream, file.FileName, file.ContentType, file.Length, documentType, description);
        var result = await Mediator.Send(command, ct);
        return result.IsSuccess ? CreatedAtRoute("GetDocumentById", new { id = result.Value }, new { id = result.Value }) : BadRequest(new { error = result.Error });
    }

    /// <summary>Get document metadata by ID.</summary>
    [Authorize(Roles = "Applicant")]
    [HttpGet("{id:guid}", Name = "GetDocumentById")]
    [ProducesResponseType(typeof(DocumentResponse), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await Mediator.Send(new GetDocumentByIdQuery(id), ct);
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { error = result.Error });
    }

    /// <summary>Get all documents for an applicant profile.</summary>
    [Authorize]
    [HttpGet("applicant/{applicantProfileId:guid}")]
    [ProducesResponseType(typeof(IReadOnlyList<DocumentResponse>), 200)]
    public async Task<IActionResult> GetByApplicant(Guid applicantProfileId, CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();
        var profile = await Mediator.Send(new TalentOS.Application.Features.Applicants.Queries.GetMyApplicantProfile.GetMyApplicantProfileQuery(userId.Value), ct);
        return profile.IsSuccess
            ? FromResult(await Mediator.Send(new GetMyDocumentsQuery(profile.Value!.Id), ct))
            : BadRequest(new { error = profile.Error });
    }

    /// <summary>Get documents owned by the current applicant.</summary>
    [Authorize(Roles = "Applicant")]
    [HttpGet("mine")]
    public async Task<IActionResult> GetMine(CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();
        var profile = await Mediator.Send(new TalentOS.Application.Features.Applicants.Queries.GetMyApplicantProfile.GetMyApplicantProfileQuery(userId.Value), ct);
        return profile.IsSuccess
            ? FromResult(await Mediator.Send(new GetMyDocumentsQuery(profile.Value!.Id), ct))
            : BadRequest(new { error = profile.Error });
    }

    /// <summary>Delete a document. Owner only.</summary>
    [Authorize]
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();
        return FromResult(await Mediator.Send(new DeleteDocumentCommand(id, userId.Value), ct));
    }

    private Guid? GetCurrentUserId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var id) ? id : null;
    }
}
