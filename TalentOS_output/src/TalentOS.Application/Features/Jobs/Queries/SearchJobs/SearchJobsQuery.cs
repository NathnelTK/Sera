using MediatR;
using TalentOS.Application.Common;
using TalentOS.Application.Features.Jobs.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.Jobs.Queries.SearchJobs;

public record SearchJobsQuery(
    PaginationFilter Filter,
    string? Category = null,
    string? Location = null,
    JobType? JobType = null,
    WorkMode? WorkMode = null) : IRequest<Result<PagedList<JobSummaryResponse>>>;
