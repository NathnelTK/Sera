using MediatR;
using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;
using TalentOS.Domain.Interfaces;
namespace TalentOS.Application.Features.Jobs.Commands.ApproveDistribution;
public sealed class ApproveDistributionCommandHandler : IRequestHandler<ApproveDistributionCommand, Result>
{
    private readonly IJobDistributionRepository _distributions; private readonly IJobRepository _jobs; private readonly IRecruiterProfileRepository _recruiters; private readonly IUnitOfWork _unit;
    public ApproveDistributionCommandHandler(IJobDistributionRepository distributions, IJobRepository jobs, IRecruiterProfileRepository recruiters, IUnitOfWork unit) { _distributions = distributions; _jobs = jobs; _recruiters = recruiters; _unit = unit; }
    public async Task<Result> Handle(ApproveDistributionCommand request, CancellationToken ct) { var distribution = await _distributions.GetByIdAsync(request.DistributionId, ct); if (distribution is null) return Result.Failure("Distribution draft not found."); var job = await _jobs.GetByIdAsync(distribution.JobId, ct); var recruiter = await _recruiters.GetByUserIdAsync(request.UserId, ct); if (job is null || recruiter is null || job.RecruiterProfileId != recruiter.Id) return Result.Failure("You do not own this distribution."); if (string.IsNullOrWhiteSpace(request.Content) || request.Content.Length > 5000) return Result.Failure("Post content must be between 1 and 5000 characters."); distribution.Content = request.Content.Trim(); distribution.Status = DistributionStatus.Approved; distribution.ApprovedAt = DateTime.UtcNow; _distributions.Update(distribution); await _unit.SaveChangesAsync(ct); return Result.Success(); }
}
