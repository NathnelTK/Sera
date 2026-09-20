namespace TalentOS.Application.Abstractions;

public interface IPdfTextExtractor
{
    Task<string> ExtractAsync(Stream pdf, CancellationToken cancellationToken = default);
}
