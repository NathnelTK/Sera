using MediatR;
using Microsoft.Extensions.Logging;
using TalentOS.Application.Abstractions;
using TalentOS.Domain.Common;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Jobs.Commands.CreateJob;

public sealed class CreateJobCommandHandler : IRequestHandler<CreateJobCommand, Result<Guid>>
{
    private readonly IJobRepository _jobs;
    private readonly IRecruiterProfileRepository _recruiters;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUser;
    private readonly ILogger<CreateJobCommandHandler> _logger;

    public CreateJobCommandHandler(IJobRepository jobs, IRecruiterProfileRepository recruiters, IUnitOfWork unitOfWork, ICurrentUserService currentUser, ILogger<CreateJobCommandHandler> logger)
    {
        _jobs = jobs;
        _recruiters = recruiters;
        _unitOfWork = unitOfWork;
        _currentUser = currentUser;
        _logger = logger;
    }

    public async Task<Result<Guid>> Handle(CreateJobCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId;
        if (userId is null) return Result<Guid>.Failure("Unauthorized.");

        var recruiter = await _recruiters.GetByUserIdAsync(userId.Value, cancellationToken);
        if (recruiter is null) return Result<Guid>.Failure("Recruiter profile not found. Please create your profile first.");

        var job = new Job
        {
            RecruiterProfileId = recruiter.Id,
            CompanyId = recruiter.CompanyId,
            Title = request.Title,
            Description = request.Description,
            Requirements = request.Requirements,
            Benefits = request.Benefits,
            JobType = request.JobType,
            WorkMode = request.WorkMode,
            ExperienceLevel = request.ExperienceLevel,
            MinimumSalary = request.MinSalary,
            MaximumSalary = request.MaxSalary,
            SalaryCurrency = (request.MinSalary.HasValue || request.MaxSalary.HasValue)
                ? (request.SalaryCurrency ?? "USD") : request.SalaryCurrency,
            DeadlineAt = request.Deadline
        };

        _jobs.Add(job);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Job created: {JobId} by recruiter: {RecruiterId}", job.Id, recruiter.Id);
        return Result<Guid>.Success(job.Id);
    }
}
