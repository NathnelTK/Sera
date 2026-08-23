using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TalentOS.Domain.Entities;

namespace TalentOS.Infrastructure.Persistence.Configurations;

public class JobApplicationConfiguration : IEntityTypeConfiguration<JobApplication>
{
    public void Configure(EntityTypeBuilder<JobApplication> builder)
    {
        builder.HasKey(a => a.Id);
        builder.Property(a => a.CoverLetter).HasMaxLength(5_000);
        builder.Property(a => a.RejectionReason).HasMaxLength(500);
        builder.Property(a => a.AiSummary).HasMaxLength(2_000);

        builder.HasIndex(a => new { a.JobId, a.ApplicantProfileId }).IsUnique();

        builder.HasOne(a => a.CV).WithMany()
            .HasForeignKey(a => a.CvId).IsRequired(false).OnDelete(DeleteBehavior.SetNull);
        builder.HasMany(a => a.Interviews).WithOne(i => i.JobApplication)
            .HasForeignKey(i => i.JobApplicationId).OnDelete(DeleteBehavior.Cascade);
    }
}
