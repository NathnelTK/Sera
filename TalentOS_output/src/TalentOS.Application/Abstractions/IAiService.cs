namespace TalentOS.Application.Abstractions;

public interface IAiService
{
    Task<ResumeAnalysisResult> AnalyzeResumeAsync(string resumeText, CancellationToken cancellationToken = default);
    Task<CandidateMatchResult> MatchCandidateAsync(string resumeText, string jobDescription, CancellationToken cancellationToken = default);
}

public sealed record ResumeAnalysisResult(
    List<string> ExtractedSkills,
    string? Summary,
    string? SuggestedHeadline,
    double? OverallScore,
    List<string> Suggestions
);

public sealed record CandidateMatchResult(
    double MatchScore,
    List<string> MatchingSkills,
    List<string> MissingSkills,
    string? AnalysisSummary
);
