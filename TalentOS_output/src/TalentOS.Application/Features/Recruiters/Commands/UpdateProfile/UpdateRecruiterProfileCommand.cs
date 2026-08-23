using MediatR;
using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.Recruiters.Commands.UpdateProfile;

public record UpdateRecruiterProfileCommand(
    Guid UserId,
    string FirstName,
    string LastName,
    string? Title,
    string? Bio,
    string? AvatarUrl,
    string? Phone,
    RecruiterType RecruiterType
) : IRequest<Result>;
