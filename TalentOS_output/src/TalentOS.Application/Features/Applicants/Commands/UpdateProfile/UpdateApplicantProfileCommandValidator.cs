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
        RuleFor(x => x.LocationCity).NotEmpty().MaximumLength(150)
            .When(x => !string.IsNullOrWhiteSpace(x.LocationCountry));
        RuleFor(x => x.LocationCountry).NotEmpty().MaximumLength(150)
            .When(x => !string.IsNullOrWhiteSpace(x.LocationCity));
        RuleFor(x => x.LocationState).MaximumLength(150).When(x => x.LocationState is not null);
        RuleFor(x => x.LocationPostalCode).MaximumLength(30).When(x => x.LocationPostalCode is not null);
        RuleFor(x => x.AvatarUrl).MaximumLength(500).Must(BeHttpUrl)
            .When(x => !string.IsNullOrWhiteSpace(x.AvatarUrl)).WithMessage("AvatarUrl must be a valid HTTP or HTTPS URL.");
        RuleFor(x => x.LinkedInUrl).MaximumLength(500).Must(BeHttpUrl)
            .When(x => !string.IsNullOrWhiteSpace(x.LinkedInUrl)).WithMessage("LinkedInUrl must be a valid HTTP or HTTPS URL.");
        RuleFor(x => x.GitHubUrl).MaximumLength(500).Must(BeHttpUrl)
            .When(x => !string.IsNullOrWhiteSpace(x.GitHubUrl)).WithMessage("GitHubUrl must be a valid HTTP or HTTPS URL.");
        RuleFor(x => x.PortfolioUrl).MaximumLength(500).Must(BeHttpUrl)
            .When(x => !string.IsNullOrWhiteSpace(x.PortfolioUrl)).WithMessage("PortfolioUrl must be a valid HTTP or HTTPS URL.");
    }

    private static bool BeHttpUrl(string? value)
        => Uri.TryCreate(value, UriKind.Absolute, out var uri)
           && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
}
