using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalentOS.Application.Common;
using TalentOS.Application.Features.Jobs.Commands.CloseJob;
using TalentOS.Application.Features.Jobs.Commands.CreateJob;
using TalentOS.Application.Features.Jobs.Commands.DeleteJob;
using TalentOS.Application.Features.Jobs.Commands.PublishJob;
using TalentOS.Application.Features.Jobs.Commands.UpdateJob;
using TalentOS.Application.Features.Jobs.DTOs;
using TalentOS.Application.Features.Jobs.Queries.GetJobApplications;
using TalentOS.Application.Features.Jobs.Queries.GetJobById;
using TalentOS.Application.Features.Jobs.Queries.GetRecruiterJobs;
using TalentOS.Application.Features.Jobs.Queries.SearchJobs;
using TalentOS.Domain.Enums;

namespace TalentOS.API.Controllers;

public sealed class JobsController : BaseApiController
{
    /// <summary>Search and list published jobs.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedList<JobSummaryResponse>), 200)]
    public async Task<IActionResult> Search(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? sortBy = null,
        CancellationToken ct = default)
    {
        var filter = new PaginationFilter { PageNumber = page, PageSize = pageSize, SearchTerm = search, SortBy = sortBy };
        return FromResult(await Mediator.Send(new SearchJobsQuery(filter), ct));
    }

    /// <summary>Get job details by ID.</summary>
    [HttpGet("{id:guid}", Name = "GetJobById")]
    [ProducesResponseType(typeof(JobDetailsResponse), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await Mediator.Send(new GetJobByIdQuery(id), ct);
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { error = result.Error });
    }

    /// <summary>Create a new job (draft). Recruiter only.</summary>
    [Authorize(Roles = "Recruiter")]
    [HttpPost]
    [ProducesResponseType(typeof(Guid), 201)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> Create([FromBody] CreateJobCommand command, CancellationToken ct)
    {
        var result = await Mediator.Send(command, ct);
        return result.IsSuccess ? CreatedAtRoute("GetJobById", new { id = result.Value }, new { id = result.Value }) : BadRequest(new { error = result.Error });
    }

    /// <summary>Update a draft job. Recruiter only.</summary>
    [Authorize(Roles = "Recruiter")]
    [HttpPut("{id:guid}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateJobCommand command, CancellationToken ct)
    {
        if (id != command.JobId) return BadRequest(new { error = "Job ID mismatch." });
        return FromResult(await Mediator.Send(command, ct));
    }

    /// <summary>Delete a job. Recruiter only.</summary>
    [Authorize(Roles = "Recruiter")]
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        => FromResult(await Mediator.Send(new DeleteJobCommand(id), ct));

    /// <summary>Publish a draft job. Recruiter only.</summary>
    [Authorize(Roles = "Recruiter")]
    [HttpPost("{id:guid}/publish")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Publish(Guid id, CancellationToken ct)
        => FromResult(await Mediator.Send(new PublishJobCommand(id), ct));

    /// <summary>Close a published job. Recruiter only.</summary>
    [Authorize(Roles = "Recruiter")]
    [HttpPost("{id:guid}/close")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Close(Guid id, CancellationToken ct)
        => FromResult(await Mediator.Send(new CloseJobCommand(id), ct));

    /// <summary>List all jobs posted by the current recruiter.</summary>
    [Authorize(Roles = "Recruiter")]
    [HttpGet("mine")]
    [ProducesResponseType(typeof(IReadOnlyList<JobSummaryResponse>), 200)]
    public async Task<IActionResult> Mine(CancellationToken ct)
    {
        // We need the recruiter profile ID; return empty if not found
        var recruiterId = GetRecruiterProfileId();
        if (recruiterId is null) return Unauthorized();
        return FromResult(await Mediator.Send(new GetRecruiterJobsQuery(recruiterId.Value), ct));
    }

    /// <summary>Get all applications for a specific job. Recruiter only.</summary>
    [Authorize(Roles = "Recruiter")]
    [HttpGet("{id:guid}/applications")]
    [ProducesResponseType(typeof(IReadOnlyList<JobApplicationSummary>), 200)]
    public async Task<IActionResult> GetApplications(Guid id, CancellationToken ct)
        => FromResult(await Mediator.Send(new GetJobApplicationsQuery(id), ct));

    // Placeholder — real implementation should resolve via RecruiterProfile lookup
    private Guid? GetRecruiterProfileId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var id) ? id : null;
    }
}
