using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalentOS.Application.Features.AI.Commands.AnalyzeResume;
using TalentOS.Application.Features.AI.Commands.MatchCandidate;
using TalentOS.Application.Features.AI.DTOs;

namespace TalentOS.API.Controllers;

public sealed class AIController : BaseApiController
{
    /// <summary>Analyze a resume text and extract key information.</summary>
    [Authorize]
    [HttpPost("analyze-resume")]
    [ProducesResponseType(typeof(ResumeAnalysisResponse), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> AnalyzeResume([FromBody] AnalyzeResumeRequest request, CancellationToken ct)
        => FromResult(await Mediator.Send(new AnalyzeResumeCommand(request.ResumeText), ct));

    /// <summary>Match a candidate's resume against a job description and return a score.</summary>
    [Authorize]
    [HttpPost("match-candidate")]
    [ProducesResponseType(typeof(CandidateMatchResponse), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> MatchCandidate([FromBody] MatchCandidateRequest request, CancellationToken ct)
        => FromResult(await Mediator.Send(new MatchCandidateCommand(request.ResumeText, request.JobDescription), ct));
}
