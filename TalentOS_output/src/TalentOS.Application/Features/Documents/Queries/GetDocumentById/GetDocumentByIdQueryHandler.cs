using MediatR;
using TalentOS.Application.Features.Documents.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Documents.Queries.GetDocumentById;

public sealed class GetDocumentByIdQueryHandler : IRequestHandler<GetDocumentByIdQuery, Result<DocumentResponse>>
{
    private readonly IDocumentRepository _documents;

    public GetDocumentByIdQueryHandler(IDocumentRepository documents) => _documents = documents;

    public async Task<Result<DocumentResponse>> Handle(GetDocumentByIdQuery request, CancellationToken cancellationToken)
    {
        var doc = await _documents.GetByIdAsync(request.DocumentId, cancellationToken);
        if (doc is null) return Result<DocumentResponse>.Failure("Document not found.");
        return Result<DocumentResponse>.Success(new DocumentResponse(doc.Id, doc.UploadedByUserId, doc.DocumentType, doc.FileName, doc.FileUrl, doc.FileSizeBytes, doc.MimeType, doc.Description, doc.CreatedAt));
    }
}
