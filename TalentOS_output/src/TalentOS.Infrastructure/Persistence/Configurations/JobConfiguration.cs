using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TalentOS.Domain.Entities;

namespace TalentOS.Infrastructure.Persistence.Configurations;

public class JobConfiguration : IEntityTypeConfiguration<Job>
{
    public void Configure(EntityTypeBuilder<Job> builder)
    {
        builder.HasKey(j => j.Id);
        builder.Property(j => j.Title).HasMaxLength(200).IsRequired();
        builder.Property(j => j.Description).HasMaxLength(10_000).IsRequired();
        builder.Property(j => j.Requirements).HasMaxLength(5_000);
        builder.Property(j => j.Benefits).HasMaxLength(3_000);
        builder.Property(j => j.SalaryCurrency).HasMaxLength(3);
        builder.Property(j => j.MinimumSalary).HasPrecision(18, 2);
        builder.Property(j => j.MaximumSalary).HasPrecision(18, 2);

        builder.HasOne(j => j.Recruiter).WithMany(r => r.PostedJobs)
            .HasForeignKey(j => j.RecruiterProfileId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(j => j.Company).WithMany(c => c.Jobs)
            .HasForeignKey(j => j.CompanyId).OnDelete(DeleteBehavior.SetNull);
        builder.HasMany(j => j.Applications).WithOne(a => a.Job)
            .HasForeignKey(a => a.JobId).OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(j => j.RequiredSkills).WithOne(js => js.Job)
            .HasForeignKey(js => js.JobId).OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(j => j.Tags).WithMany(t => t.Jobs);

        builder.HasIndex(j => j.Status);
        builder.HasIndex(j => j.PublishedAt);
    }
}
