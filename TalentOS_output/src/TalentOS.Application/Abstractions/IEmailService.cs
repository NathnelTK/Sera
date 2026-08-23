namespace TalentOS.Application.Abstractions;

public interface IEmailService
{
    Task SendAsync(string recipient, string subject, string body, CancellationToken cancellationToken = default);
    Task SendTemplateAsync(string recipient, string templateName, object templateData, CancellationToken cancellationToken = default);
}
