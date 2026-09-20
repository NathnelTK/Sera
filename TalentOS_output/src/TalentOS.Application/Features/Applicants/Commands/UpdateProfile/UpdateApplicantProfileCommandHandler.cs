using MediatR;
using TalentOS.Domain.Common;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Applicants.Commands.UpdateProfile;

public sealed class UpdateApplicantProfileCommandHandler : IRequestHandler<UpdateApplicantProfileCommand, Result>
{
    private readonly IApplicantProfileRepository _applicants;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateApplicantProfileCommandHandler(IApplicantProfileRepository applicants, IUnitOfWork unitOfWork)
    {
        _applicants = applicants;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(UpdateApplicantProfileCommand request, CancellationToken cancellationToken)
    {
        var profile = await _applicants.GetByUserIdAsync(request.UserId, cancellationToken);
        if (profile is null) return Result.Failure("Applicant profile not found.");

        profile.FirstName = request.FirstName.Trim();
        profile.LastName = request.LastName.Trim();
        profile.Headline = Clean(request.Headline);
        profile.Summary = Clean(request.Summary);
        profile.Phone = Clean(request.Phone);
        profile.AvatarUrl = Clean(request.AvatarUrl);
        profile.LinkedInUrl = Clean(request.LinkedInUrl);
        profile.GitHubUrl = Clean(request.GitHubUrl);
        profile.PortfolioUrl = Clean(request.PortfolioUrl);
        UpdateLocation(profile, request);
        profile.IsOpenToWork = request.IsOpenToWork;
        profile.SetLastModifiedBy(request.UserId.ToString());

        _applicants.Update(profile);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }

    private static string? Clean(string? value)
        => string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    private static void UpdateLocation(ApplicantProfile profile, UpdateApplicantProfileCommand request)
    {
        var city = Clean(request.LocationCity);
        var country = Clean(request.LocationCountry);
        if (city is null && country is null)
        {
            profile.Location = null;
            return;
        }

        profile.Location ??= new Location();
        profile.Location.City = city!;
        profile.Location.Country = country!;
        profile.Location.State = Clean(request.LocationState);
        profile.Location.PostalCode = Clean(request.LocationPostalCode);
    }
}
