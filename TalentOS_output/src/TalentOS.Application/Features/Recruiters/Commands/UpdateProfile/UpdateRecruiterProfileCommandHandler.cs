using MediatR;
using TalentOS.Domain.Common;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Recruiters.Commands.UpdateProfile;

public sealed class UpdateRecruiterProfileCommandHandler : IRequestHandler<UpdateRecruiterProfileCommand, Result>
{
    private readonly IRecruiterProfileRepository _recruiters;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateRecruiterProfileCommandHandler(IRecruiterProfileRepository recruiters, IUnitOfWork unitOfWork)
    {
        _recruiters = recruiters;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(UpdateRecruiterProfileCommand request, CancellationToken cancellationToken)
    {
        var profile = await _recruiters.GetByUserIdAsync(request.UserId, cancellationToken);

        if (profile is null)
        {
            // Auto-create profile on first update
            profile = new RecruiterProfile { UserId = request.UserId };
            _recruiters.Add(profile);
        }

        profile.FirstName = request.FirstName;
        profile.LastName = request.LastName;
        profile.Title = request.Title;
        profile.Bio = request.Bio;
        profile.AvatarUrl = request.AvatarUrl;
        profile.Phone = request.Phone;
        profile.RecruiterType = request.RecruiterType;
        profile.SetLastModifiedBy(request.UserId.ToString());

        _recruiters.Update(profile);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
