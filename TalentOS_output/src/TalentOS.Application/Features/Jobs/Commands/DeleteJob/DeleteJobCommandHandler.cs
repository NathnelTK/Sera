using MediatR;
using TalentOS.Application.Abstractions;
using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Jobs.Commands.DeleteJob;

public sealed class DeleteJobCommandHandler : IRequestHandler<DeleteJobCommand, Result>
{
    private readonly IJobRepository _jobs;
    private readonly IRecruiterProfileRepository _recruiters;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUser;

    public DeleteJobCommandHandler(IJobRepository jobs, IRecruiterProfileRepository recruiters, IUnitOfWork unitOfWork, ICurrentUserService currentUser)
    {
        _jobs = jobs;
        _recruiters = recruiters;
        _unitOfWork = unitOfWork;
        _currentUser = currentUser;
    }

    public async Task<Result> Handle(DeleteJobCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId;
        if (userId is null) return Result.Failure("Unauthorized.");

        var job = await _jobs.GetWithApplicationsAsync(request.JobId, cancellationToken);
        if (job is null) return Result.Failure("Job not found.");

        var recruiter = await _recruiters.GetByUserIdAsync(userId.Value, cancellationToken);
        if (recruiter is null || job.RecruiterProfileId != recruiter.Id)
            return Result.Failure("You do not have permission to delete this job.");

        if (job.Status == JobStatus.Published && job.Applications.Count > 0)
            return Result.Failure("Cannot delete a published job that has applications.");

        _jobs.Remove(job);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
