using MediatR;
using TalentOS.Application.Features.SavedJobs.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.SavedJobs.Queries.GetMySavedJobs;
public sealed record GetMySavedJobsQuery(Guid UserId) : IRequest<Result<IReadOnlyList<SavedJobResponse>>>;
