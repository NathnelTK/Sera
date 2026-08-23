using Microsoft.EntityFrameworkCore;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Interfaces;
using TalentOS.Infrastructure.Persistence;

namespace TalentOS.Infrastructure.Persistence.Repositories;

public sealed class NotificationRepository : BaseRepository<Notification>, INotificationRepository
{
    public NotificationRepository(TalentOSDbContext context) : base(context) { }

    public async Task<IReadOnlyList<Notification>> GetByUserAsync(Guid userId, bool unreadOnly, CancellationToken cancellationToken = default)
    {
        var query = DbSet.AsNoTracking().Where(n => n.UserId == userId);
        if (unreadOnly) query = query.Where(n => !n.IsRead);
        return await query.OrderByDescending(n => n.CreatedAt).ToListAsync(cancellationToken);
    }

    public async Task<int> GetUnreadCountAsync(Guid userId, CancellationToken cancellationToken = default)
        => await DbSet.CountAsync(n => n.UserId == userId && !n.IsRead, cancellationToken);
}
