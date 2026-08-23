using MediatR;
using TalentOS.Application.Features.Notifications.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Notifications.Queries.GetNotificationHistory;

public sealed class GetNotificationHistoryQueryHandler : IRequestHandler<GetNotificationHistoryQuery, Result<IReadOnlyList<NotificationResponse>>>
{
    private readonly INotificationRepository _notifications;

    public GetNotificationHistoryQueryHandler(INotificationRepository notifications) => _notifications = notifications;

    public async Task<Result<IReadOnlyList<NotificationResponse>>> Handle(GetNotificationHistoryQuery request, CancellationToken cancellationToken)
    {
        var notifications = await _notifications.GetByUserAsync(request.UserId, false, cancellationToken);
        var dtos = notifications.Select(n => new NotificationResponse(n.Id, n.NotificationType, n.Title, n.Message, n.ActionUrl, n.IsRead, n.ReadAt, n.CreatedAt)).ToList();
        return Result<IReadOnlyList<NotificationResponse>>.Success(dtos);
    }
}
