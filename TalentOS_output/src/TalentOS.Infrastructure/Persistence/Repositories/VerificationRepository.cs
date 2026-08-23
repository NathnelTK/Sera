using Microsoft.EntityFrameworkCore;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Enums;
using TalentOS.Domain.Interfaces;
using TalentOS.Infrastructure.Persistence;

namespace TalentOS.Infrastructure.Persistence.Repositories;

public sealed class VerificationRepository : BaseRepository<Verification>, IVerificationRepository
{
    public VerificationRepository(TalentOSDbContext context) : base(context) { }

    public async Task<IReadOnlyList<Verification>> GetByUserAsync(Guid userId, CancellationToken cancellationToken = default)
        => await DbSet.AsNoTracking().Where(v => v.UserId == userId).OrderByDescending(v => v.CreatedAt).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Verification>> GetPendingAsync(CancellationToken cancellationToken = default)
        => await DbSet.AsNoTracking().Include(v => v.User)
            .Where(v => v.Status == VerificationStatus.Pending).OrderBy(v => v.CreatedAt).ToListAsync(cancellationToken);

    public async Task<Verification?> GetWithDocumentsAsync(Guid id, CancellationToken cancellationToken = default)
        => await DbSet.Include(v => v.SupportingDocuments).FirstOrDefaultAsync(v => v.Id == id, cancellationToken);
}
