using FluentValidation;
using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.Applications.Commands.UpdateApplicationStatus;

public sealed class UpdateApplicationStatusCommandValidator : AbstractValidator<UpdateApplicationStatusCommand>
{
    public UpdateApplicationStatusCommandValidator()
    {
        RuleFor(x => x.ApplicationId).NotEmpty();
        RuleFor(x => x.Status).IsInEnum();
        RuleFor(x => x.RejectionReason).MaximumLength(500).When(x => x.Status == ApplicationStatus.Rejected);
    }
}
