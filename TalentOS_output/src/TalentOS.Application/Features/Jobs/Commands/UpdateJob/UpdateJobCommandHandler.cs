using MediatR;
using TalentOS.Application.Abstractions;
using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Jobs.Commands.UpdateJob;

public sealed class UpdateJobCommandHandler : IRequestHandler<UpdateJobCommand, Result>
{
    private readonly IJobRepository _jobs;
    private readonly IRecruiterProfileRepository _recruiters;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUser;

    public UpdateJobCommandHandler(IJobRepository jobs, IRecruiterProfileRepository recruiters, IUnitOfWork unitOfWork, ICurrentUserService currentUser)
    {
        _jobs = jobs;
        _recruiters = recruiters;
        _unitOfWork = unitOfWork;
        _currentUser = currentUser;
    }

    public async Task<Result> Handle(UpdateJobCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId;
        if (userId is null) return Result.Failure("Unauthorized.");

        var job = await _jobs.GetByIdAsync(request.JobId, cancellationToken);
        if (job is null) return Result.Failure("Job not found.");

        var recruiter = await _recruiters.GetByUserIdAsync(userId.Value, cancellationToken);
        if (recruiter is null || job.RecruiterProfileId != recruiter.Id)
            return Result.Failure("You do not have permission to update this job.");

        if (job.Status != JobStatus.Draft)
            return Result.Failure("Only draft jobs can be updated.");

        job.Title = request.Title;
        job.Description = request.Description;
        job.Requirements = request.Requirements;
        job.Benefits = request.Benefits;
        job.JobType = request.JobType;
        job.WorkMode = request.WorkMode;
        job.ExperienceLevel = request.ExperienceLevel;
        job.MinimumSalary = request.MinSalary;
        job.MaximumSalary = request.MaxSalary;
        job.SalaryCurrency = request.SalaryCurrency;
        job.DeadlineAt = request.Deadline;
        job.SetLastModifiedBy(userId.ToString());

        _jobs.Update(job);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
