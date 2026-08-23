using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;

namespace TalentOS.Domain.Entities;

public class User : AuditableEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Roles { get; set; } = string.Empty;
    public bool IsEmailVerified { get; set; }
    public bool IsActive { get; set; } = true;
    public string? EmailVerificationToken { get; set; }
    public DateTime? EmailVerificationTokenExpiresAt { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiresAt { get; set; }
    public string? PasswordResetToken { get; set; }
    public DateTime? PasswordResetTokenExpiresAt { get; set; }

    // Navigation properties
    public ApplicantProfile? ApplicantProfile { get; set; }
    public RecruiterProfile? RecruiterProfile { get; set; }
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public ICollection<Verification> Verifications { get; set; } = new List<Verification>();

    public IEnumerable<UserRole> GetRoles()
    {
        if (string.IsNullOrWhiteSpace(Roles))
            return Array.Empty<UserRole>();
        return Roles
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(role => Enum.TryParse<UserRole>(role, ignoreCase: true, out var parsed)
                ? parsed
                : throw new InvalidOperationException($"Invalid user role '{role}'"));
    }

    public bool HasRole(UserRole role) => GetRoles().Contains(role);
}
