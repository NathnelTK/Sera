using FluentValidation;

namespace TalentOS.Application.Features.Jobs.Commands.UpdateJob;

public sealed class UpdateJobCommandValidator : AbstractValidator<UpdateJobCommand>
{
    public UpdateJobCommandValidator()
    {
        RuleFor(x => x.JobId).NotEmpty();
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(10000);
        RuleFor(x => x.MinSalary).GreaterThanOrEqualTo(0).When(x => x.MinSalary.HasValue);
        RuleFor(x => x.MaxSalary).GreaterThan(x => x.MinSalary)
            .When(x => x.MinSalary.HasValue && x.MaxSalary.HasValue)
            .WithMessage("Max salary must be greater than min salary.");
        RuleFor(x => x.Deadline).GreaterThan(DateTime.UtcNow).When(x => x.Deadline.HasValue);
    }
}
