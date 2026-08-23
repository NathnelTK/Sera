using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.Notifications.DTOs;

public sealed record NotificationResponse(
    Guid Id,
    NotificationType NotificationType,
    string Title,
    string Message,
    string? ActionUrl,
    bool IsRead,
    DateTime? ReadAt,
    DateTime CreatedAt
);
