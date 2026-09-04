using FluentValidation;
using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.Applications.Commands.ApplyForJob;

public sealed class ApplyForJobCommandValidator : AbstractValidator<ApplyForJobCommand>
{
    public ApplyForJobCommandValidator()
    {
        RuleFor(x => x.JobId).NotEmpty();
        RuleFor(x => x.CvId).NotEmpty().WithMessage("A CV is required to apply.");
        RuleFor(x => x.Mode).IsInEnum();
        RuleFor(x => x.CoverLetter).NotEmpty().WithMessage("Manual applications require a cover letter.")
            .When(x => x.Mode == ApplicationMode.Manual);
        RuleFor(x => x.CoverLetter).MaximumLength(5000).When(x => x.CoverLetter is not null);
    }
}
