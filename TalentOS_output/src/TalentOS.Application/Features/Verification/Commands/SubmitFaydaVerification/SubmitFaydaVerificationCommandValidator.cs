using FluentValidation;

namespace TalentOS.Application.Features.Verification.Commands.SubmitFaydaVerification;

public sealed class SubmitFaydaVerificationCommandValidator : AbstractValidator<SubmitFaydaVerificationCommand>
{
    public SubmitFaydaVerificationCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Fan)
            .NotEmpty().WithMessage("The Fayda number (FAN) is required.")
            .MaximumLength(64);
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("The full name from the Fayda ID is required.")
            .MaximumLength(256);
        RuleFor(x => x.DateOfBirth).MaximumLength(32).When(x => x.DateOfBirth is not null);
        RuleFor(x => x.Gender).MaximumLength(32).When(x => x.Gender is not null);
    }
}
