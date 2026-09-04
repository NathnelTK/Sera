using MediatR;
using Microsoft.Extensions.Logging;
using TalentOS.Application.Abstractions;
using TalentOS.Domain.Common;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Enums;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Applications.Commands.ApplyForJob;

public sealed class ApplyForJobCommandHandler : IRequestHandler<ApplyForJobCommand, Result<Guid>>
{
    private readonly IJobApplicationRepository _applications;
    private readonly IJobRepository _jobs;
    private readonly IApplicantProfileRepository _applicants;
    private readonly IDocumentRepository _documents;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUser;
    private readonly ILogger<ApplyForJobCommandHandler> _logger;

    public ApplyForJobCommandHandler(IJobApplicationRepository applications, IJobRepository jobs, IApplicantProfileRepository applicants, IDocumentRepository documents, IUnitOfWork unitOfWork, ICurrentUserService currentUser, ILogger<ApplyForJobCommandHandler> logger)
    {
        _applications = applications;
        _jobs = jobs;
        _applicants = applicants;
        _documents = documents;
        _unitOfWork = unitOfWork;
        _currentUser = currentUser;
        _logger = logger;
    }

    public async Task<Result<Guid>> Handle(ApplyForJobCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId;
        if (userId is null) return Result<Guid>.Failure("Unauthorized.");

        var applicant = await _applicants.GetByUserIdAsync(userId.Value, cancellationToken);
        if (applicant is null) return Result<Guid>.Failure("Applicant profile not found.");
        if (!request.CvId.HasValue)
            return Result<Guid>.Failure("Select a CV from your document portal before applying.");
        var cvId = applicant.CVs.Any(cv => cv.Id == request.CvId.Value)
            ? request.CvId.Value
            : (await _documents.GetByApplicantAsync(applicant.Id, cancellationToken))
                .Where(d => d.Id == request.CvId.Value && d.DocumentType == DocumentType.Resume)
                .Join(applicant.CVs, d => new { d.FileUrl, d.FileName }, cv => new { cv.FileUrl, cv.FileName }, (_, cv) => cv.Id)
                .FirstOrDefault();
        if (cvId == Guid.Empty) return Result<Guid>.Failure("Select a CV from your document portal before applying.");

        var job = await _jobs.GetByIdAsync(request.JobId, cancellationToken);
        if (job is null) return Result<Guid>.Failure("Job not found.");
        if (job.Status != JobStatus.Published) return Result<Guid>.Failure("Job is not currently accepting applications.");
        if (job.DeadlineAt.HasValue && job.DeadlineAt.Value < DateTime.UtcNow)
            return Result<Guid>.Failure("Application deadline has passed.");

        if (await _applications.HasAppliedAsync(request.JobId, applicant.Id, cancellationToken))
            return Result<Guid>.Failure("You have already applied for this job.");

        var application = new JobApplication
        {
            JobId = request.JobId,
            ApplicantProfileId = applicant.Id,
            CvId = cvId,
            CoverLetter = request.CoverLetter
        };

        _applications.Add(application);
        // The unique job/applicant index is the final concurrency guard. The API error
        // middleware translates a duplicate database constraint failure consistently.
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Application submitted: {ApplicationId} for job: {JobId}", application.Id, request.JobId);
        return Result<Guid>.Success(application.Id);
    }
}
