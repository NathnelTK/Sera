using MediatR;
using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.Jobs.Commands.CreateJob;

public record CreateJobCommand(
    string Title,
    string Description,
    string? Requirements,
    string? Benefits,
    JobType JobType,
    WorkMode WorkMode,
    ExperienceLevel ExperienceLevel,
    decimal? MinSalary,
    decimal? MaxSalary,
    string? SalaryCurrency,
    DateTime? Deadline
) : IRequest<Result<Guid>>;
