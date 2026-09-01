using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.Jobs.DTOs;

public sealed record JobSummaryResponse(
    Guid Id,
    string Title,
    string Description,
    JobType JobType,
    WorkMode WorkMode,
    ExperienceLevel ExperienceLevel,
    decimal? MinSalary,
    decimal? MaxSalary,
    string? SalaryCurrency,
    JobStatus Status,
    DateTime? Deadline,
    DateTime CreatedAt,
    string RecruiterName,
    string? CompanyName,
    string? CategoryName,
    string? LocationCity,
    string? LocationCountry
);
