using MediatR;
using TalentOS.Application.Abstractions;
using TalentOS.Domain.Common;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Enums;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Interviews.Commands.ScheduleInterview;

public sealed class ScheduleInterviewCommandHandler : IRequestHandler<ScheduleInterviewCommand, Result<Guid>>
{
    private readonly IInterviewRepository _interviews;
    private readonly IJobApplicationRepository _applications;
    private readonly IJobRepository _jobs;
    private readonly IRecruiterProfileRepository _recruiters;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUser;

    public ScheduleInterviewCommandHandler(IInterviewRepository interviews, IJobApplicationRepository applications, IJobRepository jobs, IRecruiterProfileRepository recruiters, IUnitOfWork unitOfWork, ICurrentUserService currentUser)
    {
        _interviews = interviews;
        _applications = applications;
        _jobs = jobs;
        _recruiters = recruiters;
        _unitOfWork = unitOfWork;
        _currentUser = currentUser;
    }

    public async Task<Result<Guid>> Handle(ScheduleInterviewCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId;
        if (userId is null) return Result<Guid>.Failure("Unauthorized.");

        var application = await _applications.GetWithDetailsAsync(request.JobApplicationId, cancellationToken);
        if (application is null) return Result<Guid>.Failure("Application not found.");

        if (application.Status is ApplicationStatus.Withdrawn or ApplicationStatus.Rejected)
            return Result<Guid>.Failure("Cannot schedule an interview for a withdrawn or rejected application.");

        var recruiter = await _recruiters.GetByUserIdAsync(userId.Value, cancellationToken);
        if (recruiter is null) return Result<Guid>.Failure("Recruiter profile not found.");

        var job = await _jobs.GetByIdAsync(application.JobId, cancellationToken);
        if (job is null || job.RecruiterProfileId != recruiter.Id)
            return Result<Guid>.Failure("You do not have permission to schedule interviews for this application.");

        var interview = new Interview
        {
            JobApplicationId = request.JobApplicationId,
            Format = request.Format,
            ScheduledAt = request.ScheduledAt,
            DurationMinutes = request.DurationMinutes,
            MeetingLink = request.MeetingLink,
            LocationDescription = request.LocationDescription,
            Notes = request.Notes
        };

        _interviews.Add(interview);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result<Guid>.Success(interview.Id);
    }
}
