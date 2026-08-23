using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using TalentOS.Application.Abstractions;

namespace TalentOS.Infrastructure.Services;

/// <summary>
/// Local disk implementation for development/testing.
/// Replace with Azure Blob Storage, AWS S3, or similar in production.
/// </summary>
public sealed class LocalFileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<LocalFileStorageService> _logger;
    private const string UploadFolder = "uploads";

    public LocalFileStorageService(IWebHostEnvironment env, ILogger<LocalFileStorageService> logger)
    {
        _env = env;
        _logger = logger;
    }

    public async Task<string> UploadAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        var uploadsDir = Path.Combine(_env.ContentRootPath, UploadFolder);
        Directory.CreateDirectory(uploadsDir);

        var uniqueName = $"{Guid.NewGuid():N}_{Path.GetFileName(fileName)}";
        var filePath = Path.Combine(uploadsDir, uniqueName);

        await using var fs = File.Create(filePath);
        await fileStream.CopyToAsync(fs, cancellationToken);

        _logger.LogInformation("File stored locally: {FilePath}", filePath);
        return $"/{UploadFolder}/{uniqueName}";
    }

    public Task DeleteAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        var filePath = Path.Combine(_env.ContentRootPath, fileUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
        if (File.Exists(filePath)) File.Delete(filePath);
        return Task.CompletedTask;
    }

    public async Task<Stream> DownloadAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        var filePath = Path.Combine(_env.ContentRootPath, fileUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
        if (!File.Exists(filePath)) throw new FileNotFoundException($"File not found: {fileUrl}");
        return await Task.FromResult(File.OpenRead(filePath));
    }
}
