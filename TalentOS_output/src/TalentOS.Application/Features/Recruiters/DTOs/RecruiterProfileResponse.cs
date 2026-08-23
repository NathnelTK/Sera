using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.Recruiters.DTOs;

public sealed record RecruiterProfileResponse(
    Guid Id,
    Guid UserId,
    string Email,
    string FirstName,
    string LastName,
    string? Title,
    string? Bio,
    string? AvatarUrl,
    string? Phone,
    RecruiterType RecruiterType,
    string? CompanyName,
    Guid? CompanyId,
    DateTime CreatedAt
);
