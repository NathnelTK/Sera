using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.Documents.DTOs;

public sealed record DocumentResponse(
    Guid Id,
    Guid UploadedByUserId,
    DocumentType DocumentType,
    string FileName,
    string FileUrl,
    long FileSizeBytes,
    string? MimeType,
    string? Description,
    DateTime UploadedAt
);
