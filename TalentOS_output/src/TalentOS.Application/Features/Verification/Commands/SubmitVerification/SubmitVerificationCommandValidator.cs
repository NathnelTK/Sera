using FluentValidation;

namespace TalentOS.Application.Features.Verification.Commands.SubmitVerification;

public sealed class SubmitVerificationCommandValidator : AbstractValidator<SubmitVerificationCommand>
{
    public SubmitVerificationCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.VerificationType).IsInEnum();
        RuleFor(x => x.Notes).MaximumLength(1000).When(x => x.Notes is not null);
    }
}
