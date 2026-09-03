using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.SavedJobs.DTOs;

public sealed record SavedJobResponse(Guid Id, Guid JobId, string Title, string? CompanyName, JobType JobType, WorkMode WorkMode, DateTime SavedAt);
