using MediatR;
using TalentOS.Application.Abstractions;
using TalentOS.Application.Features.AI.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.AI.Commands.MatchCandidate;

public sealed class MatchCandidateCommandHandler : IRequestHandler<MatchCandidateCommand, Result<CandidateMatchResponse>>
{
    private readonly IAiService _aiService;

    public MatchCandidateCommandHandler(IAiService aiService) => _aiService = aiService;

    public async Task<Result<CandidateMatchResponse>> Handle(MatchCandidateCommand request, CancellationToken cancellationToken)
    {
        var result = await _aiService.MatchCandidateAsync(request.ResumeText, request.JobDescription, cancellationToken);
        return Result<CandidateMatchResponse>.Success(new CandidateMatchResponse(result.MatchScore, result.MatchingSkills, result.MissingSkills, result.AnalysisSummary));
    }
}
