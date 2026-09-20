using MediatR;
using TalentOS.Application.Features.Recruiters.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Recruiters.Queries.GetMyRecruiterProfile;

public sealed class GetMyRecruiterProfileQueryHandler : IRequestHandler<GetMyRecruiterProfileQuery, Result<RecruiterProfileResponse>>
{
    private readonly IRecruiterProfileRepository recruiters;
    private readonly IVerificationRepository verifications;
    public GetMyRecruiterProfileQueryHandler(IRecruiterProfileRepository recruiters, IVerificationRepository verifications)
    {
        this.recruiters = recruiters;
        this.verifications = verifications;
    }

    public async Task<Result<RecruiterProfileResponse>> Handle(GetMyRecruiterProfileQuery request, CancellationToken ct)
    {
        var ownProfile = await recruiters.GetByUserIdAsync(request.UserId, ct);
        var profile = ownProfile is null ? null : await recruiters.GetWithCompanyAsync(ownProfile.Id, ct);
        if (profile is null) return Result<RecruiterProfileResponse>.Failure("Recruiter profile not found.");
        var verification = (await verifications.GetByUserAsync(request.UserId, ct)).FirstOrDefault();
        return Result<RecruiterProfileResponse>.Success(new RecruiterProfileResponse(
            profile.Id, profile.UserId, profile.User?.Email ?? string.Empty, profile.FirstName, profile.LastName,
            profile.Title, profile.Bio, profile.AvatarUrl, profile.Phone, profile.RecruiterType,
            profile.Company?.Name, profile.CompanyId, profile.CreatedAt,
            verification?.Status ?? TalentOS.Domain.Enums.VerificationStatus.Pending));
    }
}
