namespace TalentOS.Application.Features.AI.DTOs;

public sealed record AnalyzeResumeRequest(string ResumeText);
public sealed record MatchCandidateRequest(string ResumeText, string JobDescription);

public sealed record ResumeAnalysisResponse(
    List<string> ExtractedSkills,
    string? Summary,
    string? SuggestedHeadline,
    double? OverallScore,
    List<string> Suggestions
);

public sealed record CandidateMatchResponse(
    double MatchScore,
    List<string> MatchingSkills,
    List<string> MissingSkills,
    string? AnalysisSummary
);
