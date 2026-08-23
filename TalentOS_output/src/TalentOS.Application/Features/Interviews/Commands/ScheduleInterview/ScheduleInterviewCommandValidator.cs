using FluentValidation;

namespace TalentOS.Application.Features.Interviews.Commands.ScheduleInterview;

public sealed class ScheduleInterviewCommandValidator : AbstractValidator<ScheduleInterviewCommand>
{
    public ScheduleInterviewCommandValidator()
    {
        RuleFor(x => x.JobApplicationId).NotEmpty();
        RuleFor(x => x.Format).IsInEnum();
        RuleFor(x => x.ScheduledAt).GreaterThan(DateTime.UtcNow).WithMessage("Interview must be scheduled in the future.");
        RuleFor(x => x.DurationMinutes).InclusiveBetween(15, 480).WithMessage("Duration must be between 15 and 480 minutes.");
        RuleFor(x => x.MeetingLink).Must(url => Uri.TryCreate(url, UriKind.Absolute, out _))
            .When(x => !string.IsNullOrEmpty(x.MeetingLink))
            .WithMessage("MeetingLink must be a valid URL.");
    }
}
