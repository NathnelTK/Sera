using FluentValidation;

namespace TalentOS.Application.Features.AI.Commands.AnalyzeResume;

public sealed class AnalyzeResumeCommandValidator : AbstractValidator<AnalyzeResumeCommand>
{
    public AnalyzeResumeCommandValidator()
    {
        RuleFor(x => x.ResumeText).NotEmpty().MinimumLength(50).MaximumLength(50_000);
    }
}
