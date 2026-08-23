using MediatR;
using TalentOS.Application.Abstractions;
using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Jobs.Commands.PublishJob;

public sealed class PublishJobCommandHandler : IRequestHandler<PublishJobCommand, Result>
{
    private readonly IJobRepository _jobs;
    private readonly IRecruiterProfileRepository _recruiters;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUser;

    public PublishJobCommandHandler(IJobRepository jobs, IRecruiterProfileRepository recruiters, IUnitOfWork unitOfWork, ICurrentUserService currentUser)
    {
        _jobs = jobs;
        _recruiters = recruiters;
        _unitOfWork = unitOfWork;
        _currentUser = currentUser;
    }

    public async Task<Result> Handle(PublishJobCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId;
        if (userId is null) return Result.Failure("Unauthorized.");

        var job = await _jobs.GetByIdAsync(request.JobId, cancellationToken);
        if (job is null) return Result.Failure("Job not found.");

        var recruiter = await _recruiters.GetByUserIdAsync(userId.Value, cancellationToken);
        if (recruiter is null || job.RecruiterProfileId != recruiter.Id)
            return Result.Failure("You do not have permission to publish this job.");

        if (job.Status != JobStatus.Draft)
            return Result.Failure("Only draft jobs can be published.");

        job.Status = JobStatus.Published;
        job.PublishedAt = DateTime.UtcNow;
        job.SetLastModifiedBy(userId.ToString());

        _jobs.Update(job);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
