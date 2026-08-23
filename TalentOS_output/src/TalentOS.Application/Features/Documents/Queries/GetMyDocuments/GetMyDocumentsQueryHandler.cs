using MediatR;
using TalentOS.Application.Features.Documents.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Documents.Queries.GetMyDocuments;

public sealed class GetMyDocumentsQueryHandler : IRequestHandler<GetMyDocumentsQuery, Result<IReadOnlyList<DocumentResponse>>>
{
    private readonly IDocumentRepository _documents;

    public GetMyDocumentsQueryHandler(IDocumentRepository documents) => _documents = documents;

    public async Task<Result<IReadOnlyList<DocumentResponse>>> Handle(GetMyDocumentsQuery request, CancellationToken cancellationToken)
    {
        var docs = await _documents.GetByApplicantAsync(request.ApplicantProfileId, cancellationToken);
        var dtos = docs.Select(d => new DocumentResponse(d.Id, d.UploadedByUserId, d.DocumentType, d.FileName, d.FileUrl, d.FileSizeBytes, d.MimeType, d.Description, d.CreatedAt)).ToList();
        return Result<IReadOnlyList<DocumentResponse>>.Success(dtos);
    }
}
