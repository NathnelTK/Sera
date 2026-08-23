using MediatR;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Notifications.Commands.MarkAsRead;

public record MarkNotificationAsReadCommand(Guid NotificationId, Guid UserId) : IRequest<Result>;
