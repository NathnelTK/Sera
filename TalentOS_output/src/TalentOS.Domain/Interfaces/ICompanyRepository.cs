using TalentOS.Domain.Entities;

namespace TalentOS.Domain.Interfaces;

public interface ICompanyRepository : IRepository<Company>
{
    Task<Company?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
}
