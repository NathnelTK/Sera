namespace TalentOS.Domain.Common;

public abstract class AuditableEntity : BaseEntity
{
    public string? CreatedBy { get; protected set; }
    public string? LastModifiedBy { get; protected set; }

    protected AuditableEntity(string? createdBy = null) : base()
    {
        CreatedBy = createdBy;
        LastModifiedBy = createdBy;
    }

    public void SetLastModifiedBy(string? modifier)
    {
        LastModifiedBy = modifier;
        TouchUpdatedAt();
    }
}
