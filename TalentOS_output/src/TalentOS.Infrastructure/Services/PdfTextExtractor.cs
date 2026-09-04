using System.Text;
using UglyToad.PdfPig;
using TalentOS.Application.Abstractions;

namespace TalentOS.Infrastructure.Services;

public sealed class PdfTextExtractor : IPdfTextExtractor
{
    public async Task<string> ExtractAsync(Stream pdf, CancellationToken cancellationToken = default)
    {
        if (!pdf.CanSeek)
        {
            var copy = new MemoryStream();
            await pdf.CopyToAsync(copy, cancellationToken);
            copy.Position = 0;
            pdf = copy;
        }
        using var document = PdfDocument.Open(pdf);
        var text = new StringBuilder();
        foreach (var page in document.GetPages())
        {
            cancellationToken.ThrowIfCancellationRequested();
            text.AppendLine(page.Text);
        }
        return text.ToString().Trim();
    }
}
