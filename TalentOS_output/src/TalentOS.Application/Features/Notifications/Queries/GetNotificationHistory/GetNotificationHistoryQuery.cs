using MediatR;
using TalentOS.Application.Features.Notifications.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Notifications.Queries.GetNotificationHistory;

public record GetNotificationHistoryQuery(Guid UserId) : IRequest<Result<IReadOnlyList<NotificationResponse>>>;
