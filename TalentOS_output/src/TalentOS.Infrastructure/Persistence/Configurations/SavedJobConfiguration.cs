using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TalentOS.Domain.Entities;

namespace TalentOS.Infrastructure.Persistence.Configurations;

public sealed class SavedJobConfiguration : IEntityTypeConfiguration<SavedJob>
{
    public void Configure(EntityTypeBuilder<SavedJob> builder)
    {
        builder.HasKey(x => x.Id);
        builder.HasIndex(x => new { x.ApplicantProfileId, x.JobId }).IsUnique();
        builder.HasOne(x => x.ApplicantProfile).WithMany().HasForeignKey(x => x.ApplicantProfileId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(x => x.Job).WithMany().HasForeignKey(x => x.JobId).OnDelete(DeleteBehavior.Cascade);
    }
}
