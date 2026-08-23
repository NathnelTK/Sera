using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.Jobs.DTOs;

public sealed record JobDetailsResponse(
    Guid Id,
    string Title,
    string Description,
    string? Requirements,
    string? Benefits,
    JobType JobType,
    WorkMode WorkMode,
    ExperienceLevel ExperienceLevel,
    decimal? MinSalary,
    decimal? MaxSalary,
    string? SalaryCurrency,
    JobStatus Status,
    DateTime? Deadline,
    DateTime? PublishedAt,
    DateTime CreatedAt,
    string RecruiterName,
    Guid RecruiterProfileId,
    string? CompanyName,
    Guid? CompanyId,
    int ApplicationCount
);
