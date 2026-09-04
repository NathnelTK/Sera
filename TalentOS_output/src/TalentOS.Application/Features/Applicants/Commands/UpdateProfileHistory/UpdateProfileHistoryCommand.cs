using MediatR;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Applicants.Commands.UpdateProfileHistory;

public sealed record EducationInput(Guid? Id, string Institution, string Degree, string FieldOfStudy, int StartYear, int? EndYear, bool IsOngoing, string? Description);
public sealed record ExperienceInput(Guid? Id, string CompanyName, string Title, DateTime StartDate, DateTime? EndDate, bool IsCurrentPosition, string? Description, string? EmploymentType, string? LocationDescription);
public sealed record UpdateProfileHistoryCommand(Guid UserId, IReadOnlyList<EducationInput> Educations, IReadOnlyList<ExperienceInput> Experiences) : IRequest<Result>;
