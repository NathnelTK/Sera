using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TalentOS.Domain.Entities;

namespace TalentOS.Infrastructure.Persistence.Configurations;

public class ApplicantProfileConfiguration : IEntityTypeConfiguration<ApplicantProfile>
{
    public void Configure(EntityTypeBuilder<ApplicantProfile> builder)
    {
        builder.HasKey(a => a.Id);
        builder.Property(a => a.FirstName).HasMaxLength(100).IsRequired();
        builder.Property(a => a.LastName).HasMaxLength(100).IsRequired();
        builder.Property(a => a.Headline).HasMaxLength(200);
        builder.Property(a => a.Summary).HasMaxLength(2_000);
        builder.Property(a => a.Phone).HasMaxLength(30);
        builder.Property(a => a.AvatarUrl).HasMaxLength(500);
        builder.Property(a => a.LinkedInUrl).HasMaxLength(500);
        builder.Property(a => a.GitHubUrl).HasMaxLength(500);
        builder.Property(a => a.PortfolioUrl).HasMaxLength(500);

        builder.HasOne(a => a.Location).WithMany()
            .HasForeignKey("LocationId").IsRequired(false).OnDelete(DeleteBehavior.SetNull);
        builder.HasMany(a => a.CVs).WithOne(cv => cv.ApplicantProfile)
            .HasForeignKey(cv => cv.ApplicantProfileId).OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(a => a.Applications).WithOne(app => app.ApplicantProfile)
            .HasForeignKey(app => app.ApplicantProfileId).OnDelete(DeleteBehavior.Restrict);
        builder.HasMany(a => a.Skills).WithOne(s => s.ApplicantProfile)
            .HasForeignKey(s => s.ApplicantProfileId).OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(a => a.Educations).WithOne(e => e.ApplicantProfile)
            .HasForeignKey(e => e.ApplicantProfileId).OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(a => a.Experiences).WithOne(e => e.ApplicantProfile)
            .HasForeignKey(e => e.ApplicantProfileId).OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(a => a.Documents).WithOne()
            .HasForeignKey(d => d.ApplicantProfileId).IsRequired(false).OnDelete(DeleteBehavior.SetNull);
        builder.HasMany(a => a.MediaLinks).WithOne(m => m.ApplicantProfile)
            .HasForeignKey(m => m.ApplicantProfileId).OnDelete(DeleteBehavior.Cascade);
    }
}
