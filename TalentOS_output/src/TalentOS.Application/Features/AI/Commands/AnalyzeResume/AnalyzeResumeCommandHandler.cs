using MediatR;
using TalentOS.Application.Abstractions;
using TalentOS.Application.Features.AI.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.AI.Commands.AnalyzeResume;

public sealed class AnalyzeResumeCommandHandler : IRequestHandler<AnalyzeResumeCommand, Result<ResumeAnalysisResponse>>
{
    private readonly IAiService _aiService;

    public AnalyzeResumeCommandHandler(IAiService aiService) => _aiService = aiService;

    public async Task<Result<ResumeAnalysisResponse>> Handle(AnalyzeResumeCommand request, CancellationToken cancellationToken)
    {
        var result = await _aiService.AnalyzeResumeAsync(request.ResumeText, cancellationToken);
        return Result<ResumeAnalysisResponse>.Success(new ResumeAnalysisResponse(result.ExtractedSkills, result.Summary, result.SuggestedHeadline, result.OverallScore, result.Suggestions));
    }
}
