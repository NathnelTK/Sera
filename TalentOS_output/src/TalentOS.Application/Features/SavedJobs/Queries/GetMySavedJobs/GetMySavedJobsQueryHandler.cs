using MediatR;
using TalentOS.Application.Features.SavedJobs.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.SavedJobs.Queries.GetMySavedJobs;
public sealed class GetMySavedJobsQueryHandler : IRequestHandler<GetMySavedJobsQuery, Result<IReadOnlyList<SavedJobResponse>>>
{
    private readonly IApplicantProfileRepository _applicants; private readonly ISavedJobRepository _saved;
    public GetMySavedJobsQueryHandler(IApplicantProfileRepository applicants, ISavedJobRepository saved) { _applicants = applicants; _saved = saved; }
    public async Task<Result<IReadOnlyList<SavedJobResponse>>> Handle(GetMySavedJobsQuery request, CancellationToken ct) { var a = await _applicants.GetByUserIdAsync(request.UserId, ct); if (a is null) return Result<IReadOnlyList<SavedJobResponse>>.Failure("Applicant profile not found."); var list = await _saved.GetByApplicantAsync(a.Id, ct); return Result<IReadOnlyList<SavedJobResponse>>.Success(list.Select(x => new SavedJobResponse(x.Id, x.JobId, x.Job.Title, x.Job.Company?.Name, x.Job.JobType, x.Job.WorkMode, x.CreatedAt)).ToList()); }
}
