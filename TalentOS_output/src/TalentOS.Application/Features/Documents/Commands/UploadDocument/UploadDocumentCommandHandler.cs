using MediatR;
using Microsoft.Extensions.Logging;
using TalentOS.Application.Abstractions;
using TalentOS.Domain.Common;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Documents.Commands.UploadDocument;

public sealed class UploadDocumentCommandHandler : IRequestHandler<UploadDocumentCommand, Result<Guid>>
{
    private readonly IDocumentRepository _documents;
    private readonly IFileStorageService _fileStorage;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UploadDocumentCommandHandler> _logger;

    public UploadDocumentCommandHandler(IDocumentRepository documents, IFileStorageService fileStorage, IUnitOfWork unitOfWork, ILogger<UploadDocumentCommandHandler> logger)
    {
        _documents = documents;
        _fileStorage = fileStorage;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Result<Guid>> Handle(UploadDocumentCommand request, CancellationToken cancellationToken)
    {
        const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10 MB
        if (request.FileSizeBytes > MaxFileSizeBytes)
            return Result<Guid>.Failure("File size exceeds the 10 MB limit.");

        string fileUrl;
        try
        {
            fileUrl = await _fileStorage.UploadAsync(request.FileStream, request.FileName, request.ContentType, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "File upload failed for user {UserId}", request.UserId);
            return Result<Guid>.Failure("File upload failed. Please try again.");
        }

        var document = new Document
        {
            UploadedByUserId = request.UserId,
            ApplicantProfileId = request.ApplicantProfileId,
            DocumentType = request.DocumentType,
            FileName = request.FileName,
            FileUrl = fileUrl,
            FileSizeBytes = request.FileSizeBytes,
            MimeType = request.ContentType,
            Description = request.Description
        };

        _documents.Add(document);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result<Guid>.Success(document.Id);
    }
}
