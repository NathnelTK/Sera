using MediatR;
using TalentOS.Application.Abstractions;
using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Applications.Commands.WithdrawApplication;

public sealed class WithdrawApplicationCommandHandler : IRequestHandler<WithdrawApplicationCommand, Result>
{
    private readonly IJobApplicationRepository _applications;
    private readonly IApplicantProfileRepository _applicants;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUser;

    public WithdrawApplicationCommandHandler(IJobApplicationRepository applications, IApplicantProfileRepository applicants, IUnitOfWork unitOfWork, ICurrentUserService currentUser)
    {
        _applications = applications;
        _applicants = applicants;
        _unitOfWork = unitOfWork;
        _currentUser = currentUser;
    }

    public async Task<Result> Handle(WithdrawApplicationCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId;
        if (userId is null) return Result.Failure("Unauthorized.");

        var applicant = await _applicants.GetByUserIdAsync(userId.Value, cancellationToken);
        if (applicant is null) return Result.Failure("Applicant profile not found.");

        var application = await _applications.GetByIdAsync(request.ApplicationId, cancellationToken);
        if (application is null) return Result.Failure("Application not found.");
        if (application.ApplicantProfileId != applicant.Id) return Result.Failure("You do not own this application.");
        if (application.Status == ApplicationStatus.Accepted) return Result.Failure("Cannot withdraw an accepted application.");
        if (application.Status == ApplicationStatus.Withdrawn) return Result.Failure("Application is already withdrawn.");

        application.Status = ApplicationStatus.Withdrawn;
        application.WithdrawnAt = DateTime.UtcNow;
        _applications.Update(application);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
