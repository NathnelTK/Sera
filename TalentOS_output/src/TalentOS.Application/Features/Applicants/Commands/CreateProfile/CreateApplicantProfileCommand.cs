using MediatR;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Applicants.Commands.CreateProfile;

public record CreateApplicantProfileCommand(Guid UserId, string FirstName, string LastName) : IRequest<Result<Guid>>;
