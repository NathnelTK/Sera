using MediatR;
using TalentOS.Application.Features.Jobs.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Jobs.Queries.GetRecruiterJobs;

public record GetRecruiterJobsQuery(Guid RecruiterProfileId) : IRequest<Result<IReadOnlyList<JobSummaryResponse>>>;
