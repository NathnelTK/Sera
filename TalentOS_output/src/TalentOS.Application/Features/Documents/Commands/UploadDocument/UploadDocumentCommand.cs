using MediatR;
using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.Documents.Commands.UploadDocument;

public record UploadDocumentCommand(
    Guid UserId,
    Guid? ApplicantProfileId,
    Stream FileStream,
    string FileName,
    string ContentType,
    long FileSizeBytes,
    DocumentType DocumentType,
    string? Description
) : IRequest<Result<Guid>>;
