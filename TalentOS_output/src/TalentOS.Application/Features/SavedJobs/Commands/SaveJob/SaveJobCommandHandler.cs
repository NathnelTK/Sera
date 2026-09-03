using MediatR;
using TalentOS.Domain.Common;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Enums;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.SavedJobs.Commands.SaveJob;
public sealed class SaveJobCommandHandler : IRequestHandler<SaveJobCommand, Result>
{
    private readonly IApplicantProfileRepository _applicants; private readonly IJobRepository _jobs; private readonly ISavedJobRepository _saved; private readonly IUnitOfWork _unit;
    public SaveJobCommandHandler(IApplicantProfileRepository applicants, IJobRepository jobs, ISavedJobRepository saved, IUnitOfWork unit) { _applicants = applicants; _jobs = jobs; _saved = saved; _unit = unit; }
    public async Task<Result> Handle(SaveJobCommand request, CancellationToken ct)
    {
        var applicant = await _applicants.GetByUserIdAsync(request.UserId, ct); if (applicant is null) return Result.Failure("Applicant profile not found.");
        var job = await _jobs.GetByIdAsync(request.JobId, ct); if (job is null || job.Status != JobStatus.Published) return Result.Failure("Job is not available.");
        if (await _saved.GetByApplicantAndJobAsync(applicant.Id, request.JobId, ct) is not null) return Result.Success();
        _saved.Add(new SavedJob { ApplicantProfileId = applicant.Id, JobId = request.JobId }); await _unit.SaveChangesAsync(ct); return Result.Success();
    }
}
