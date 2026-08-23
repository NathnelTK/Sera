using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.Applicants.DTOs;

public sealed record ApplicantProfileResponse(
    Guid Id,
    Guid UserId,
    string Email,
    string FirstName,
    string LastName,
    string? Headline,
    string? Summary,
    string? Phone,
    string? AvatarUrl,
    string? LinkedInUrl,
    string? GitHubUrl,
    string? PortfolioUrl,
    bool IsOpenToWork,
    LocationDto? Location,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public sealed record LocationDto(string City, string Country, string? State, string? PostalCode);

public sealed record ApplicantSkillResponse(
    Guid SkillId,
    string SkillName,
    SkillLevel Level,
    int? YearsOfExperience
);

public sealed record EducationResponse(
    Guid Id,
    string Institution,
    string Degree,
    string FieldOfStudy,
    string? Grade,
    string? Description,
    int StartYear,
    int? EndYear,
    bool IsOngoing
);

public sealed record ExperienceResponse(
    Guid Id,
    string CompanyName,
    string Title,
    string? Description,
    string? EmploymentType,
    string? LocationDescription,
    DateTime StartDate,
    DateTime? EndDate,
    bool IsCurrentPosition
);
