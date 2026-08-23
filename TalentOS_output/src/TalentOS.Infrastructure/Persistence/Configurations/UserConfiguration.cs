using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TalentOS.Domain.Entities;

namespace TalentOS.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Email).HasMaxLength(256).IsRequired();
        builder.HasIndex(u => u.Email).IsUnique();
        builder.Property(u => u.PasswordHash).IsRequired();
        builder.Property(u => u.Roles).HasMaxLength(200).IsRequired();
        builder.Property(u => u.RefreshToken).HasMaxLength(500);

        builder.HasOne(u => u.ApplicantProfile).WithOne(a => a.User)
            .HasForeignKey<ApplicantProfile>(a => a.UserId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(u => u.RecruiterProfile).WithOne(r => r.User)
            .HasForeignKey<RecruiterProfile>(r => r.UserId).OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(u => u.Notifications).WithOne(n => n.User)
            .HasForeignKey(n => n.UserId).OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(u => u.Verifications).WithOne(v => v.User)
            .HasForeignKey(v => v.UserId).OnDelete(DeleteBehavior.Cascade);
    }
}
