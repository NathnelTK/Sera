using TalentOS.Domain.Common;

namespace TalentOS.Domain.Entities;

public class Location : BaseEntity
{
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
}
