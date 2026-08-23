using FluentValidation;

namespace TalentOS.Application.Features.AI.Commands.MatchCandidate;

public sealed class MatchCandidateCommandValidator : AbstractValidator<MatchCandidateCommand>
{
    public MatchCandidateCommandValidator()
    {
        RuleFor(x => x.ResumeText).NotEmpty().MinimumLength(50).MaximumLength(50_000);
        RuleFor(x => x.JobDescription).NotEmpty().MinimumLength(50).MaximumLength(20_000);
    }
}
