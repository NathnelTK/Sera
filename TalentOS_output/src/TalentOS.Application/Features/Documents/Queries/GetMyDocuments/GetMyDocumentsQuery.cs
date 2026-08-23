using MediatR;
using TalentOS.Application.Features.Documents.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Documents.Queries.GetMyDocuments;

public record GetMyDocumentsQuery(Guid ApplicantProfileId) : IRequest<Result<IReadOnlyList<DocumentResponse>>>;
