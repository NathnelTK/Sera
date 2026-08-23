using TalentOS.Domain.Interfaces;
using TalentOS.Infrastructure.Persistence;

namespace TalentOS.Infrastructure.Services;

public sealed class UnitOfWork : IUnitOfWork
{
    private readonly TalentOSDbContext _context;
    private bool _disposed;

    public UnitOfWork(TalentOSDbContext context) => _context = context;

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        => await _context.SaveChangesAsync(cancellationToken);

    public void Dispose()
    {
        if (!_disposed) { _context.Dispose(); _disposed = true; }
    }
}
