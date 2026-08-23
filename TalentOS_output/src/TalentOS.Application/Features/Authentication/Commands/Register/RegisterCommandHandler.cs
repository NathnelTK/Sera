using MediatR;
using Microsoft.Extensions.Logging;
using TalentOS.Domain.Common;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Authentication.Commands.Register;

public sealed class RegisterCommandHandler : IRequestHandler<RegisterCommand, Result>
{
    private readonly IUserRepository _users;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<RegisterCommandHandler> _logger;

    public RegisterCommandHandler(IUserRepository users, IUnitOfWork unitOfWork, ILogger<RegisterCommandHandler> logger)
    {
        _users = users;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Result> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Registration attempt for email: {Email}", request.Email);

        if (await _users.EmailExistsAsync(request.Email, cancellationToken))
        {
            _logger.LogWarning("Registration failed — email already in use: {Email}", request.Email);
            return Result.Failure("An account with this email already exists.");
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        var user = new User
        {
            Email = request.Email.Trim().ToLowerInvariant(),
            PasswordHash = passwordHash,
            Roles = request.Role.ToString()
        };

        _users.Add(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("User registered successfully. ID: {UserId}", user.Id);
        return Result.Success();
    }
}
