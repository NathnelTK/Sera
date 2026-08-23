using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalentOS.Application.Features.Notifications.Commands.MarkAsRead;
using TalentOS.Application.Features.Notifications.DTOs;
using TalentOS.Application.Features.Notifications.Queries.GetMyNotifications;
using TalentOS.Application.Features.Notifications.Queries.GetNotificationHistory;

namespace TalentOS.API.Controllers;

public sealed class NotificationsController : BaseApiController
{
    /// <summary>Get current user's unread notifications.</summary>
    [Authorize]
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<NotificationResponse>), 200)]
    public async Task<IActionResult> GetMine([FromQuery] bool unreadOnly = false, CancellationToken ct = default)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();
        return FromResult(await Mediator.Send(new GetMyNotificationsQuery(userId.Value, unreadOnly), ct));
    }

    /// <summary>Get notification history (all read and unread).</summary>
    [Authorize]
    [HttpGet("history")]
    [ProducesResponseType(typeof(IReadOnlyList<NotificationResponse>), 200)]
    public async Task<IActionResult> GetHistory(CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();
        return FromResult(await Mediator.Send(new GetNotificationHistoryQuery(userId.Value), ct));
    }

    /// <summary>Mark a specific notification as read.</summary>
    [Authorize]
    [HttpPut("{id:guid}/read")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> MarkRead(Guid id, CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();
        return FromResult(await Mediator.Send(new MarkNotificationAsReadCommand(id, userId.Value), ct));
    }

    private Guid? GetCurrentUserId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var id) ? id : null;
    }
}
