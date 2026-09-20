namespace TalentOS.Application.Features.Applicants.DTOs;

public sealed record ApplicantDiscoveryResponse(
    Guid Id,
    string FirstName,
    string LastName,
    string? Headline,
    string? Summary,
    string? AvatarUrl,
    bool IsOpenToWork,
    LocationDto? Location,
    IReadOnlyList<ApplicantDiscoverySkill> Skills,
    IReadOnlyList<ApplicantDiscoveryExperience> Experiences
);

public sealed record ApplicantDiscoverySkill(string Name, int Level, int? YearsOfExperience);

public sealed record ApplicantDiscoveryExperience(
    string CompanyName,
    string Title,
    string? Description,
    DateTime StartDate,
    DateTime? EndDate,
    bool IsCurrentPosition
);
