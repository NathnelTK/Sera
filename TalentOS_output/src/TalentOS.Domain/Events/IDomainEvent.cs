namespace TalentOS.Domain.Events;

public interface IDomainEvent
{
    DateTime OccurredOn { get; }
}
