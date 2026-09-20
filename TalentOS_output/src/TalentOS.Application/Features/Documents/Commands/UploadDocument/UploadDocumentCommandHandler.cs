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
    private readonly IApplicantProfileRepository _applicants;
    private readonly IPdfTextExtractor _pdf;

    public UploadDocumentCommandHandler(IDocumentRepository documents, IFileStorageService fileStorage, IUnitOfWork unitOfWork, ILogger<UploadDocumentCommandHandler> logger, IApplicantProfileRepository applicants, IPdfTextExtractor pdf)
    {
        _documents = documents;
        _fileStorage = fileStorage;
        _unitOfWork = unitOfWork;
        _logger = logger;
        _applicants = applicants;
        _pdf = pdf;
    }

    public async Task<Result<Guid>> Handle(UploadDocumentCommand request, CancellationToken cancellationToken)
    {
        const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10 MB
        if (request.FileSizeBytes > MaxFileSizeBytes)
            return Result<Guid>.Failure("File size exceeds the 10 MB limit.");

        // Use a tracked profile here because the resume CV is added to its collection.
        var applicant = await _applicants.GetByUserIdAsync(request.UserId, cancellationToken);
        if (applicant is null) return Result<Guid>.Failure("Applicant profile not found.");

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
            ApplicantProfileId = applicant.Id,
            DocumentType = request.DocumentType,
            FileName = request.FileName,
            FileUrl = fileUrl,
            FileSizeBytes = request.FileSizeBytes,
            MimeType = request.ContentType,
            Description = request.Description
        };

        _documents.Add(document);
        if (request.DocumentType == TalentOS.Domain.Enums.DocumentType.Resume)
        {
            string? rawText = null;
            if (string.Equals(request.ContentType, "application/pdf", StringComparison.OrdinalIgnoreCase))
            {
                request.FileStream.Position = 0;
                rawText = await _pdf.ExtractAsync(request.FileStream, cancellationToken);
            }
            applicant.CVs.Add(new CV
            {
                ApplicantProfileId = applicant.Id,
                FileName = request.FileName,
                FileUrl = fileUrl,
                FileSizeBytes = request.FileSizeBytes,
                IsPrimary = !applicant.CVs.Any(c => c.IsPrimary),
                RawTextContent = rawText
            });
        }
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result<Guid>.Success(document.Id);
    }
}
