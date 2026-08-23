using MediatR;
using TalentOS.Domain.Common;
using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.Authentication.Commands.Register;

public record RegisterCommand(string Email, string Password, string ConfirmPassword, UserRole Role)
    : IRequest<Result>;
