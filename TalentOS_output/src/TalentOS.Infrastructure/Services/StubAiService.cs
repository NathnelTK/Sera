using TalentOS.Application.Abstractions;

namespace TalentOS.Infrastructure.Services;

/// <summary>
/// Stub AI implementation — replace with OpenAI, Azure AI, or custom ML model in production.
/// </summary>
public sealed class StubAiService : IAiService
{
    public Task<ResumeAnalysisResult> AnalyzeResumeAsync(string resumeText, CancellationToken cancellationToken = default)
    {
        // Parse basic skills keywords as a demo
        var keywords = new[] { "C#", ".NET", "SQL", "Azure", "Docker", "Git", "Python", "JavaScript", "TypeScript" };
        var found = keywords.Where(k => resumeText.Contains(k, StringComparison.OrdinalIgnoreCase)).ToList();

        var result = new ResumeAnalysisResult(
            ExtractedSkills: found,
            Summary: "AI analysis stub — integrate a real AI provider for production.",
            SuggestedHeadline: found.Count > 0 ? $"{found[0]} Developer" : "Software Engineer",
            OverallScore: found.Count > 0 ? Math.Min(found.Count * 10.0, 95.0) : 40.0,
            Suggestions: new List<string>
            {
                "Add quantifiable achievements to your experience.",
                "Include a professional summary at the top.",
                "List relevant certifications."
            }
        );
        return Task.FromResult(result);
    }

    public Task<CandidateMatchResult> MatchCandidateAsync(string resumeText, string jobDescription, CancellationToken cancellationToken = default)
    {
        var keywords = new[] { "C#", ".NET", "SQL", "Azure", "Docker", "Git", "Python", "JavaScript", "TypeScript", "React" };
        var inResume = keywords.Where(k => resumeText.Contains(k, StringComparison.OrdinalIgnoreCase)).ToHashSet();
        var inJob = keywords.Where(k => jobDescription.Contains(k, StringComparison.OrdinalIgnoreCase)).ToHashSet();

        var matching = inResume.Intersect(inJob).ToList();
        var missing = inJob.Except(inResume).ToList();
        var score = inJob.Count == 0 ? 50.0 : Math.Round(matching.Count / (double)inJob.Count * 100, 1);

        return Task.FromResult(new CandidateMatchResult(score, matching, missing, "Stub AI match — integrate a real AI provider for production results."));
    }
}
