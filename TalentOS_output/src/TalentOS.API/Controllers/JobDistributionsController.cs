using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalentOS.Application.Features.Jobs.Commands.ApproveDistribution;
using TalentOS.Application.Features.Jobs.Commands.PrepareDistribution;
using TalentOS.Application.Features.Jobs.Queries.GetDistributions;
using TalentOS.Domain.Enums;

namespace TalentOS.API.Controllers;

[Authorize(Roles = "Recruiter")]
public sealed class JobDistributionsController : BaseApiController
{
    [HttpGet("job/{jobId:guid}")]
    public async Task<IActionResult> Get(Guid jobId, CancellationToken ct) { var id = CurrentUser(); return id is null ? Unauthorized() : FromResult(await Mediator.Send(new GetDistributionsQuery(id.Value, jobId), ct)); }
    [HttpPost("job/{jobId:guid}/prepare")]
    public async Task<IActionResult> Prepare(Guid jobId, [FromBody] PrepareRequest request, CancellationToken ct) { var id = CurrentUser(); return id is null ? Unauthorized() : FromResult(await Mediator.Send(new PrepareDistributionCommand(id.Value, jobId, request.Channels), ct)); }
    [HttpPut("{id:guid}/approve")]
    public async Task<IActionResult> Approve(Guid id, [FromBody] ApproveRequest request, CancellationToken ct) { var user = CurrentUser(); return user is null ? Unauthorized() : FromResult(await Mediator.Send(new ApproveDistributionCommand(user.Value, id, request.Content), ct)); }
    private Guid? CurrentUser() { var value = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value; return Guid.TryParse(value, out var id) ? id : null; }
    public sealed record PrepareRequest(IReadOnlyList<DistributionChannel> Channels);
    public sealed record ApproveRequest(string Content);
}
