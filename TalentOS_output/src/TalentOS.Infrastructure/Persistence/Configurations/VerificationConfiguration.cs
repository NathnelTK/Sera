using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TalentOS.Domain.Entities;

namespace TalentOS.Infrastructure.Persistence.Configurations;

public class VerificationConfiguration : IEntityTypeConfiguration<Verification>
{
    public void Configure(EntityTypeBuilder<Verification> builder)
    {
        builder.HasKey(v => v.Id);
        builder.Property(v => v.Notes).HasMaxLength(1_000);
        builder.Property(v => v.RejectionReason).HasMaxLength(500);
        builder.HasIndex(v => new { v.UserId, v.Status });
    }
}
