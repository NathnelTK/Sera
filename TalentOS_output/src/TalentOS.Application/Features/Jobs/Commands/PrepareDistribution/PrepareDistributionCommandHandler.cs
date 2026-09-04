using MediatR;
using TalentOS.Domain.Common;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Enums;
using TalentOS.Domain.Interfaces;
namespace TalentOS.Application.Features.Jobs.Commands.PrepareDistribution;
public sealed class PrepareDistributionCommandHandler : IRequestHandler<PrepareDistributionCommand, Result>
{
    private readonly IJobRepository _jobs; private readonly IRecruiterProfileRepository _recruiters; private readonly IJobDistributionRepository _distributions; private readonly IUnitOfWork _unit;
    public PrepareDistributionCommandHandler(IJobRepository jobs, IRecruiterProfileRepository recruiters, IJobDistributionRepository distributions, IUnitOfWork unit) { _jobs = jobs; _recruiters = recruiters; _distributions = distributions; _unit = unit; }
    public async Task<Result> Handle(PrepareDistributionCommand request, CancellationToken ct)
    { var recruiter = await _recruiters.GetByUserIdAsync(request.UserId, ct); var job = await _jobs.GetByIdAsync(request.JobId, ct); if (recruiter is null || job is null || job.RecruiterProfileId != recruiter.Id) return Result.Failure("You do not own this job."); foreach (var channel in request.Channels.Distinct()) { var existing = await _distributions.GetByJobAndChannelAsync(job.Id, channel, ct); var content = channel == DistributionChannel.Website ? $"{job.Title}\n\n{job.Description}" : $"We are hiring: {job.Title}. {job.Description[..Math.Min(job.Description.Length, 400)]}\nApply through TalentOS."; if (existing is null) _distributions.Add(new JobDistribution { JobId = job.Id, Channel = channel, Content = content }); else { existing.Content = content; existing.Status = DistributionStatus.Draft; _distributions.Update(existing); } } await _unit.SaveChangesAsync(ct); return Result.Success(); }
}
