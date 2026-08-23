using MediatR;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Applicants.Commands.UpdateProfile;

public record UpdateApplicantProfileCommand(
    Guid UserId,
    string FirstName,
    string LastName,
    string? Headline,
    string? Summary,
    string? Phone,
    string? AvatarUrl,
    string? LinkedInUrl,
    string? GitHubUrl,
    string? PortfolioUrl,
    bool IsOpenToWork
) : IRequest<Result>;
