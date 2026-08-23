using MediatR;
using TalentOS.Application.Common;
using TalentOS.Application.Features.Jobs.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Jobs.Queries.SearchJobs;

public record SearchJobsQuery(PaginationFilter Filter) : IRequest<Result<PagedList<JobSummaryResponse>>>;
