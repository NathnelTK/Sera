using Microsoft.EntityFrameworkCore;
using TalentOS.Application.Abstractions;
using TalentOS.Domain.Entities;

namespace TalentOS.Infrastructure.Persistence;

public class TalentOSDbContext : DbContext
{
    private readonly ICurrentUserService _currentUser;

    public TalentOSDbContext(DbContextOptions<TalentOSDbContext> options, ICurrentUserService currentUser)
        : base(options)
    {
        _currentUser = currentUser;
    }

    // Core tables
    public DbSet<User> Users => Set<User>();
    public DbSet<ApplicantProfile> ApplicantProfiles => Set<ApplicantProfile>();
    public DbSet<RecruiterProfile> RecruiterProfiles => Set<RecruiterProfile>();
    public DbSet<Company> Companies => Set<Company>();
    public DbSet<Job> Jobs => Set<Job>();
    public DbSet<JobApplication> JobApplications => Set<JobApplication>();
    public DbSet<Interview> Interviews => Set<Interview>();
    public DbSet<Verification> Verifications => Set<Verification>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<CV> CVs => Set<CV>();
    public DbSet<ApplicantSkill> ApplicantSkills => Set<ApplicantSkill>();
    public DbSet<Skill> Skills => Set<Skill>();
    public DbSet<JobSkill> JobSkills => Set<JobSkill>();
    public DbSet<Education> Educations => Set<Education>();
    public DbSet<Experience> Experiences => Set<Experience>();
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<MediaLink> MediaLinks => Set<MediaLink>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<Category> Categories => Set<Category>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(TalentOSDbContext).Assembly);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await base.SaveChangesAsync(cancellationToken);
    }
}
