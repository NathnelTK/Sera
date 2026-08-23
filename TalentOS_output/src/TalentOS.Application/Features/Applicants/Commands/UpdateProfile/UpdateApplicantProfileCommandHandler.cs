using MediatR;
using TalentOS.Domain.Common;
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

        profile.FirstName = request.FirstName;
        profile.LastName = request.LastName;
        profile.Headline = request.Headline;
        profile.Summary = request.Summary;
        profile.Phone = request.Phone;
        profile.AvatarUrl = request.AvatarUrl;
        profile.LinkedInUrl = request.LinkedInUrl;
        profile.GitHubUrl = request.GitHubUrl;
        profile.PortfolioUrl = request.PortfolioUrl;
        profile.IsOpenToWork = request.IsOpenToWork;
        profile.SetLastModifiedBy(request.UserId.ToString());

        _applicants.Update(profile);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
