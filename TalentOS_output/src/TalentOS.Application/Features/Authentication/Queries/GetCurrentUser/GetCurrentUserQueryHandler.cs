using MediatR;
using TalentOS.Application.Features.Authentication.DTOs;
using TalentOS.Domain.Common;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Authentication.Queries.GetCurrentUser;

public sealed class GetCurrentUserQueryHandler : IRequestHandler<GetCurrentUserQuery, Result<CurrentUserDto>>
{
    private readonly IUserRepository _users;

    public GetCurrentUserQueryHandler(IUserRepository users) => _users = users;

    public async Task<Result<CurrentUserDto>> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var user = await _users.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null) return Result<CurrentUserDto>.Failure("User not found.");

        var dto = new CurrentUserDto(user.Id, user.Email, user.GetRoles().Select(r => r.ToString()), user.IsEmailVerified);
        return Result<CurrentUserDto>.Success(dto);
    }
}
