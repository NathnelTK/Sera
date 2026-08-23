using MediatR;
using TalentOS.Application.Features.Recruiters.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Recruiters.Queries.GetRecruiterById;

public sealed class GetRecruiterByIdQueryHandler : IRequestHandler<GetRecruiterByIdQuery, Result<RecruiterProfileResponse>>
{
    private readonly IRecruiterProfileRepository _recruiters;

    public GetRecruiterByIdQueryHandler(IRecruiterProfileRepository recruiters) => _recruiters = recruiters;

    public async Task<Result<RecruiterProfileResponse>> Handle(GetRecruiterByIdQuery request, CancellationToken cancellationToken)
    {
        var profile = await _recruiters.GetWithCompanyAsync(request.RecruiterId, cancellationToken);
        if (profile is null) return Result<RecruiterProfileResponse>.Failure("Recruiter profile not found.");

        var dto = new RecruiterProfileResponse(
            profile.Id, profile.UserId,
            profile.User?.Email ?? string.Empty,
            profile.FirstName, profile.LastName,
            profile.Title, profile.Bio, profile.AvatarUrl, profile.Phone,
            profile.RecruiterType,
            profile.Company?.Name, profile.CompanyId,
            profile.CreatedAt);

        return Result<RecruiterProfileResponse>.Success(dto);
    }
}
