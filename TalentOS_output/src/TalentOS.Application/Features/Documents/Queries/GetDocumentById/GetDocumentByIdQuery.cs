using MediatR;
using TalentOS.Application.Features.Documents.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Documents.Queries.GetDocumentById;

public record GetDocumentByIdQuery(Guid DocumentId) : IRequest<Result<DocumentResponse>>;
