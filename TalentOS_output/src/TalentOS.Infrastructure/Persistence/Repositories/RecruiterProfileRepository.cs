using Microsoft.EntityFrameworkCore;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Interfaces;
using TalentOS.Infrastructure.Persistence;

namespace TalentOS.Infrastructure.Persistence.Repositories;

public sealed class RecruiterProfileRepository : BaseRepository<RecruiterProfile>, IRecruiterProfileRepository
{
    public RecruiterProfileRepository(TalentOSDbContext context) : base(context) { }

    public async Task<RecruiterProfile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        => await DbSet.Include(r => r.User).FirstOrDefaultAsync(r => r.UserId == userId, cancellationToken);

    public async Task<RecruiterProfile?> GetWithCompanyAsync(Guid id, CancellationToken cancellationToken = default)
        => await DbSet.Include(r => r.User).Include(r => r.Company).FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
}
