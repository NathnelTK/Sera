using MediatR;
using TalentOS.Application.Abstractions;
using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Applications.Commands.UpdateApplicationStatus;

public sealed class UpdateApplicationStatusCommandHandler : IRequestHandler<UpdateApplicationStatusCommand, Result>
{
    private readonly IJobApplicationRepository _applications;
    private readonly IJobRepository _jobs;
    private readonly IRecruiterProfileRepository _recruiters;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUser;

    public UpdateApplicationStatusCommandHandler(IJobApplicationRepository applications, IJobRepository jobs, IRecruiterProfileRepository recruiters, IUnitOfWork unitOfWork, ICurrentUserService currentUser)
    {
        _applications = applications;
        _jobs = jobs;
        _recruiters = recruiters;
        _unitOfWork = unitOfWork;
        _currentUser = currentUser;
    }

    public async Task<Result> Handle(UpdateApplicationStatusCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId;
        if (userId is null) return Result.Failure("Unauthorized.");

        var application = await _applications.GetWithDetailsAsync(request.ApplicationId, cancellationToken);
        if (application is null) return Result.Failure("Application not found.");

        var recruiter = await _recruiters.GetByUserIdAsync(userId.Value, cancellationToken);
        if (recruiter is null) return Result.Failure("Recruiter profile not found.");

        var job = await _jobs.GetByIdAsync(application.JobId, cancellationToken);
        if (job is null || job.RecruiterProfileId != recruiter.Id)
            return Result.Failure("You do not have permission to update this application.");

        if (request.Status == ApplicationStatus.Withdrawn)
            return Result.Failure("Cannot set status to Withdrawn — only applicants can withdraw.");

        if (!IsAllowedTransition(application.Status, request.Status))
            return Result.Failure($"Cannot move an application from {application.Status} to {request.Status}.");

        application.Status = request.Status;
        application.ReviewedAt = DateTime.UtcNow;
        if (request.Status == ApplicationStatus.Rejected)
            application.RejectionReason = request.RejectionReason;

        _applications.Update(application);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }

    private static bool IsAllowedTransition(ApplicationStatus current, ApplicationStatus next)
    {
        if (current == ApplicationStatus.Rejected || current == ApplicationStatus.Accepted)
            return false;

        return next switch
        {
            ApplicationStatus.Submitted => current == ApplicationStatus.Submitted,
            ApplicationStatus.UnderReview => current is ApplicationStatus.Submitted or ApplicationStatus.UnderReview,
            ApplicationStatus.Shortlisted => current is ApplicationStatus.UnderReview or ApplicationStatus.Shortlisted,
            ApplicationStatus.Accepted => current is ApplicationStatus.Shortlisted,
            ApplicationStatus.Rejected => current is ApplicationStatus.Submitted or ApplicationStatus.UnderReview or ApplicationStatus.Shortlisted,
            _ => false,
        };
    }
}
