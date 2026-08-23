using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.Recruiters.DTOs;

public sealed record UpdateRecruiterProfileRequest(
    string FirstName,
    string LastName,
    string? Title,
    string? Bio,
    string? AvatarUrl,
    string? Phone,
    RecruiterType RecruiterType
);
