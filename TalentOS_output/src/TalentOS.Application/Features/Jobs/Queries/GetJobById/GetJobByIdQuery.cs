using MediatR;
using TalentOS.Application.Features.Jobs.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Jobs.Queries.GetJobById;

public record GetJobByIdQuery(Guid JobId) : IRequest<Result<JobDetailsResponse>>;
