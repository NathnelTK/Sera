using MediatR;
using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.Applications.Commands.ApplyForJob;

public record ApplyForJobCommand(Guid JobId, string? CoverLetter, Guid? CvId, ApplicationMode Mode = ApplicationMode.Quick) : IRequest<Result<Guid>>;
