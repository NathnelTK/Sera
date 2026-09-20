using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TalentOS.Domain.Entities;

namespace TalentOS.Infrastructure.Persistence.Configurations;

public sealed class JobDistributionConfiguration : IEntityTypeConfiguration<JobDistribution>
{
    public void Configure(EntityTypeBuilder<JobDistribution> builder)
    {
        builder.HasKey(x => x.Id); builder.Property(x => x.Content).HasMaxLength(5000).IsRequired();
        builder.HasIndex(x => new { x.JobId, x.Channel }).IsUnique();
        builder.HasOne(x => x.Job).WithMany().HasForeignKey(x => x.JobId).OnDelete(DeleteBehavior.Cascade);
    }
}
