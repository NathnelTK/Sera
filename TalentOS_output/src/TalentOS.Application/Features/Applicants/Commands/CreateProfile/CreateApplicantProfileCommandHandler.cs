using MediatR;
using TalentOS.Domain.Common;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Applicants.Commands.CreateProfile;

public sealed class CreateApplicantProfileCommandHandler : IRequestHandler<CreateApplicantProfileCommand, Result<Guid>>
{
    private readonly IApplicantProfileRepository _applicants;
    private readonly IUserRepository _users;
    private readonly IUnitOfWork _unitOfWork;

    public CreateApplicantProfileCommandHandler(IApplicantProfileRepository applicants, IUserRepository users, IUnitOfWork unitOfWork)
    {
        _applicants = applicants;
        _users = users;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Guid>> Handle(CreateApplicantProfileCommand request, CancellationToken cancellationToken)
    {
        var existing = await _applicants.GetByUserIdAsync(request.UserId, cancellationToken);
        if (existing is not null) return Result<Guid>.Success(existing.Id);

        var user = await _users.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null) return Result<Guid>.Failure("User not found.");

        var profile = new ApplicantProfile
        {
            UserId = request.UserId,
            FirstName = request.FirstName,
            LastName = request.LastName
        };

        _applicants.Add(profile);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result<Guid>.Success(profile.Id);
    }
}
