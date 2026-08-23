using Microsoft.Extensions.Logging;
using TalentOS.Application.Abstractions;

namespace TalentOS.Infrastructure.Services;

/// <summary>
/// Stub implementation — replace with SendGrid, Mailgun, or similar in production.
/// </summary>
public sealed class EmailService : IEmailService
{
    private readonly ILogger<EmailService> _logger;

    public EmailService(ILogger<EmailService> logger) => _logger = logger;

    public Task SendAsync(string recipient, string subject, string body, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Email (stub): To={Recipient} | Subject={Subject}", recipient, subject);
        return Task.CompletedTask;
    }

    public Task SendTemplateAsync(string recipient, string templateName, object templateData, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Email template (stub): To={Recipient} | Template={Template}", recipient, templateName);
        return Task.CompletedTask;
    }
}
