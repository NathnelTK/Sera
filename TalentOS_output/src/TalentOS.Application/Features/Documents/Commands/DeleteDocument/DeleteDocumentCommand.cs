using MediatR;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Documents.Commands.DeleteDocument;

public record DeleteDocumentCommand(Guid DocumentId, Guid RequestingUserId) : IRequest<Result>;
