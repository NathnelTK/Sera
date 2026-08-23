using FluentValidation;

namespace TalentOS.Application.Features.Recruiters.Commands.UpdateProfile;

public sealed class UpdateRecruiterProfileCommandValidator : AbstractValidator<UpdateRecruiterProfileCommand>
{
    public UpdateRecruiterProfileCommandValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Title).MaximumLength(150).When(x => x.Title is not null);
        RuleFor(x => x.Bio).MaximumLength(1000).When(x => x.Bio is not null);
    }
}
