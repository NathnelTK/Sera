using TalentOS.Application.Abstractions;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace TalentOS.Infrastructure.Services;

/// <summary>
/// Stub AI implementation — replace with OpenAI, Azure AI, or custom ML model in production.
/// </summary>
public sealed class LocalAiService : IAiService
{
    private readonly HttpClient _http;
    private readonly string? _model;

    public LocalAiService(IHttpClientFactory clients, IConfiguration configuration)
    {
        _http = clients.CreateClient("LocalAi");
        _model = configuration["AI:OllamaModel"] ?? "llama3.2:3b";
    }

    public async Task<ResumeAnalysisResult> AnalyzeResumeAsync(string resumeText, CancellationToken cancellationToken = default)
    {
        // Parse basic skills keywords as a demo
        var keywords = new[] { "C#", ".NET", "SQL", "Azure", "Docker", "Git", "Python", "JavaScript", "TypeScript" };
        var found = keywords.Where(k => resumeText.Contains(k, StringComparison.OrdinalIgnoreCase)).ToList();

        var fallback = new ResumeAnalysisResult(
            ExtractedSkills: found,
            Summary: found.Count > 0 ? $"Profile demonstrates experience with {string.Join(", ", found)}." : "Add more detail about your professional experience.",
            SuggestedHeadline: found.Count > 0 ? $"{found[0]} Developer" : "Software Engineer",
            OverallScore: found.Count > 0 ? Math.Min(found.Count * 10.0, 95.0) : 40.0,
            Suggestions: new List<string>
            {
                "Add quantifiable achievements to your experience.",
                "Include a professional summary at the top.",
                "List relevant certifications."
            }
        );
        var prompt = $"Analyze this resume briefly. Return JSON only with keys Summary, SuggestedHeadline, Suggestions (array), ExtractedSkills (array). Resume:\n{resumeText}";
        var ai = await TryAskAsync<ResumeAnalysisResult>(prompt, cancellationToken);
        return ai is null ? fallback : ai with { OverallScore = fallback.OverallScore };
    }

    public async Task<CandidateMatchResult> MatchCandidateAsync(string resumeText, string jobDescription, CancellationToken cancellationToken = default)
    {
        var keywords = new[] { "C#", ".NET", "SQL", "Azure", "Docker", "Git", "Python", "JavaScript", "TypeScript", "React" };
        var inResume = keywords.Where(k => resumeText.Contains(k, StringComparison.OrdinalIgnoreCase)).ToHashSet();
        var inJob = keywords.Where(k => jobDescription.Contains(k, StringComparison.OrdinalIgnoreCase)).ToHashSet();

        var matching = inResume.Intersect(inJob).ToList();
        var missing = inJob.Except(inResume).ToList();
        var score = inJob.Count == 0 ? 50.0 : Math.Round(matching.Count / (double)inJob.Count * 100, 1);

        var fallback = new CandidateMatchResult(score, matching, missing,
            missing.Count == 0
                ? $"Strong match: the profile covers all detected job skills ({string.Join(", ", matching)})."
                : $"The profile matches {matching.Count} of {inJob.Count} detected job skills. Missing: {string.Join(", ", missing)}. Add evidence of these skills to improve the application.");
        var prompt = $"Compare candidate resume to job description. Return JSON only with keys MatchScore (number), MatchingSkills (array), MissingSkills (array), AnalysisSummary (string). Resume:\n{resumeText}\nJob:\n{jobDescription}";
        return await TryAskAsync<CandidateMatchResult>(prompt, cancellationToken) ?? fallback;
    }

    private async Task<T?> TryAskAsync<T>(string prompt, CancellationToken cancellationToken)
    {
        try
        {
            using var response = await _http.PostAsJsonAsync("api/generate", new { model = _model, prompt, stream = false, format = "json" }, cancellationToken);
            if (!response.IsSuccessStatusCode) return default;
            var result = await response.Content.ReadFromJsonAsync<OllamaResponse>(cancellationToken);
            return result?.Response is null ? default : JsonSerializer.Deserialize<T>(result.Response);
        }
        catch (HttpRequestException) { return default; }
        catch (JsonException) { return default; }
    }

    private sealed record OllamaResponse(string? Response);
}
