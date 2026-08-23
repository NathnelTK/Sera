using FluentValidation;

namespace TalentOS.Application.Features.Documents.Commands.UploadDocument;

public sealed class UploadDocumentCommandValidator : AbstractValidator<UploadDocumentCommand>
{
    private static readonly HashSet<string> AllowedMimeTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg", "image/png", "image/webp"
    };

    public UploadDocumentCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.FileName).NotEmpty().MaximumLength(255);
        RuleFor(x => x.FileSizeBytes).GreaterThan(0).LessThanOrEqualTo(10 * 1024 * 1024);
        RuleFor(x => x.ContentType).Must(ct => AllowedMimeTypes.Contains(ct))
            .WithMessage("Unsupported file type. Allowed: PDF, Word documents, JPEG, PNG, WEBP.");
        RuleFor(x => x.DocumentType).IsInEnum();
    }
}
