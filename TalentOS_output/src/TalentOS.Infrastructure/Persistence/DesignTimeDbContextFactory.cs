using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using TalentOS.Infrastructure.Persistence;

namespace TalentOS.Infrastructure.Persistence;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<TalentOSDbContext>
{
    public TalentOSDbContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<TalentOSDbContext>();
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        
        optionsBuilder.UseNpgsql(connectionString);

        return new TalentOSDbContext(optionsBuilder.Options, new DesignTimeCurrentUserService());
    }
}

public class DesignTimeCurrentUserService : TalentOS.Application.Abstractions.ICurrentUserService
{
    public Guid? UserId => Guid.Parse("00000000-0000-0000-0000-000000000001"); // Design time user
    public string? Email => "design-time@example.com";
    public string? Role => "Admin";
    public bool IsAuthenticated => true;
}