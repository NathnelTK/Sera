using TalentOS.Domain.Enums;

namespace TalentOS.Application.Features.Applications.DTOs;

public sealed record UpdateApplicationStatusRequest(ApplicationStatus Status, string? RejectionReason);
