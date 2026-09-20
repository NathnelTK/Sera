namespace TalentOS.Application.Features.Applicants.DTOs;

public sealed record UpdateApplicantProfileRequest(
    string FirstName,
    string LastName,
    string? Headline,
    string? Summary,
    string? Phone,
    string? AvatarUrl,
    string? LinkedInUrl,
    string? GitHubUrl,
    string? PortfolioUrl,
    string? LocationCity,
    string? LocationCountry,
    string? LocationState,
    string? LocationPostalCode,
    bool IsOpenToWork
);
