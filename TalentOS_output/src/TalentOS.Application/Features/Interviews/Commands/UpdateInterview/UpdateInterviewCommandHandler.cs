using MediatR;
using TalentOS.Application.Abstractions;
using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Interviews.Commands.UpdateInterview;

public sealed class UpdateInterviewCommandHandler : IRequestHandler<UpdateInterviewCommand, Result>
{
    private readonly IInterviewRepository _interviews;
    private readonly IJobApplicationRepository _applications;
    private readonly IJobRepository _jobs;
    private readonly IRecruiterProfileRepository _recruiters;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUser;

    public UpdateInterviewCommandHandler(IInterviewRepository interviews, IJobApplicationRepository applications, IJobRepository jobs, IRecruiterProfileRepository recruiters, IUnitOfWork unitOfWork, ICurrentUserService currentUser)
    {
        _interviews = interviews;
        _applications = applications;
        _jobs = jobs;
        _recruiters = recruiters;
        _unitOfWork = unitOfWork;
        _currentUser = currentUser;
    }

    public async Task<Result> Handle(UpdateInterviewCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId;
        if (userId is null) return Result.Failure("Unauthorized.");

        var interview = await _interviews.GetByIdAsync(request.InterviewId, cancellationToken);
        if (interview is null) return Result.Failure("Interview not found.");
        if (interview.Status != InterviewStatus.Scheduled) return Result.Failure("Only scheduled interviews can be updated.");

        var application = await _applications.GetWithDetailsAsync(interview.JobApplicationId, cancellationToken);
        var recruiter = await _recruiters.GetByUserIdAsync(userId.Value, cancellationToken);
        var job = application is not null ? await _jobs.GetByIdAsync(application.JobId, cancellationToken) : null;

        if (recruiter is null || job is null || job.RecruiterProfileId != recruiter.Id)
            return Result.Failure("You do not have permission to update this interview.");

        interview.Format = request.Format;
        interview.ScheduledAt = request.ScheduledAt;
        interview.DurationMinutes = request.DurationMinutes;
        interview.MeetingLink = request.MeetingLink;
        interview.LocationDescription = request.LocationDescription;
        interview.Notes = request.Notes;
        interview.Status = InterviewStatus.Rescheduled;

        _interviews.Update(interview);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
