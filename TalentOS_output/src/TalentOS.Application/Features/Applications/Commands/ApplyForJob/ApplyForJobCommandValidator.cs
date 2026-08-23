using FluentValidation;

namespace TalentOS.Application.Features.Applications.Commands.ApplyForJob;

public sealed class ApplyForJobCommandValidator : AbstractValidator<ApplyForJobCommand>
{
    public ApplyForJobCommandValidator()
    {
        RuleFor(x => x.JobId).NotEmpty();
        RuleFor(x => x.CoverLetter).MaximumLength(5000).When(x => x.CoverLetter is not null);
    }
}
