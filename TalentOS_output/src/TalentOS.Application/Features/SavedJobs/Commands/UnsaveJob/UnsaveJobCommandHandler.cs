using MediatR;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.SavedJobs.Commands.UnsaveJob;
public sealed class UnsaveJobCommandHandler : IRequestHandler<UnsaveJobCommand, Result>
{
    private readonly IApplicantProfileRepository _applicants; private readonly ISavedJobRepository _saved; private readonly IUnitOfWork _unit;
    public UnsaveJobCommandHandler(IApplicantProfileRepository applicants, ISavedJobRepository saved, IUnitOfWork unit) { _applicants = applicants; _saved = saved; _unit = unit; }
    public async Task<Result> Handle(UnsaveJobCommand request, CancellationToken ct) { var a = await _applicants.GetByUserIdAsync(request.UserId, ct); if (a is null) return Result.Failure("Applicant profile not found."); var saved = await _saved.GetByApplicantAndJobAsync(a.Id, request.JobId, ct); if (saved is not null) { _saved.Remove(saved); await _unit.SaveChangesAsync(ct); } return Result.Success(); }
}
