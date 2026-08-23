namespace TalentOS.Domain.Exceptions;

public sealed class UnauthorizedDomainException : DomainException
{
    public UnauthorizedDomainException(string message) : base(message) { }
}
