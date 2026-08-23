using MediatR;
using TalentOS.Application.Features.Jobs.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Jobs.Queries.GetJobApplications;

public record GetJobApplicationsQuery(Guid JobId) : IRequest<Result<IReadOnlyList<JobApplicationSummary>>>;
