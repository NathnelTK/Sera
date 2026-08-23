using MediatR;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Applications.Commands.ApplyForJob;

public record ApplyForJobCommand(Guid JobId, string? CoverLetter, Guid? CvId) : IRequest<Result<Guid>>;
