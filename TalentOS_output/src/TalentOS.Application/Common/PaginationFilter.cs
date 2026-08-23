namespace TalentOS.Application.Common;

public sealed class PaginationFilter
{
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 10;
    public string? SearchTerm { get; init; }
    public string? SortBy { get; init; }

    public int EffectivePageNumber => PageNumber < 1 ? 1 : PageNumber;
    public int EffectivePageSize => PageSize < 1 ? 10 : Math.Min(PageSize, 100);
    public int Skip => (EffectivePageNumber - 1) * EffectivePageSize;
}
