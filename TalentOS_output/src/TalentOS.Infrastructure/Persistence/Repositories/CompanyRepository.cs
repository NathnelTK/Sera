using Microsoft.EntityFrameworkCore;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Interfaces;
using TalentOS.Infrastructure.Persistence;

namespace TalentOS.Infrastructure.Persistence.Repositories;

public sealed class CompanyRepository : BaseRepository<Company>, ICompanyRepository
{
    public CompanyRepository(TalentOSDbContext context) : base(context) { }

    public async Task<Company?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
        => await DbSet.FirstOrDefaultAsync(c => c.Name.ToLower() == name.ToLower(), cancellationToken);
}
