using FluentValidation;

namespace TalentOS.Application.Features.Applicants.Commands.UpdateProfile;

public sealed class UpdateApplicantProfileCommandValidator : AbstractValidator<UpdateApplicantProfileCommand>
{
    public UpdateApplicantProfileCommandValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Headline).MaximumLength(200).When(x => x.Headline is not null);
        RuleFor(x => x.Summary).MaximumLength(2000).When(x => x.Summary is not null);
        RuleFor(x => x.Phone).MaximumLength(30).When(x => x.Phone is not null);
        RuleFor(x => x.LinkedInUrl).Must(u => Uri.TryCreate(u, UriKind.Absolute, out _))
            .When(x => !string.IsNullOrEmpty(x.LinkedInUrl)).WithMessage("LinkedInUrl must be a valid URL.");
    }
}
