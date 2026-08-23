using MediatR;
using TalentOS.Application.Abstractions;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Documents.Commands.DeleteDocument;

public sealed class DeleteDocumentCommandHandler : IRequestHandler<DeleteDocumentCommand, Result>
{
    private readonly IDocumentRepository _documents;
    private readonly IFileStorageService _fileStorage;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteDocumentCommandHandler(IDocumentRepository documents, IFileStorageService fileStorage, IUnitOfWork unitOfWork)
    {
        _documents = documents;
        _fileStorage = fileStorage;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(DeleteDocumentCommand request, CancellationToken cancellationToken)
    {
        var document = await _documents.GetByIdAsync(request.DocumentId, cancellationToken);
        if (document is null) return Result.Failure("Document not found.");
        if (document.UploadedByUserId != request.RequestingUserId)
            return Result.Failure("You do not have permission to delete this document.");

        await _fileStorage.DeleteAsync(document.FileUrl, cancellationToken);
        _documents.Remove(document);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
