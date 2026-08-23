namespace TalentOS.Application.Features.Authentication.DTOs;

public sealed record CurrentUserDto(Guid Id, string Email, IEnumerable<string> Roles, bool IsEmailVerified);
