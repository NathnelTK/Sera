using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TalentOS.Domain.Entities;

namespace TalentOS.Infrastructure.Persistence.Configurations;

public class InterviewConfiguration : IEntityTypeConfiguration<Interview>
{
    public void Configure(EntityTypeBuilder<Interview> builder)
    {
        builder.HasKey(i => i.Id);
        builder.Property(i => i.MeetingLink).HasMaxLength(1_000);
        builder.Property(i => i.LocationDescription).HasMaxLength(500);
        builder.Property(i => i.Notes).HasMaxLength(2_000);
        builder.Property(i => i.CancellationReason).HasMaxLength(500);
        builder.HasIndex(i => i.ScheduledAt);
    }
}
