using MediatR;
using TalentOS.Application.Features.Notifications.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Notifications.Queries.GetMyNotifications;

public record GetMyNotificationsQuery(Guid UserId, bool UnreadOnly = false)
    : IRequest<Result<IReadOnlyList<NotificationResponse>>>;
