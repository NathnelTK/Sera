using MediatR;
using TalentOS.Domain.Common;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Interfaces;

namespace TalentOS.Application.Features.Applicants.Commands.UpdateProfileHistory;

public sealed class UpdateProfileHistoryCommandHandler : IRequestHandler<UpdateProfileHistoryCommand, Result>
{
    private readonly IApplicantProfileRepository _profiles; private readonly IUnitOfWork _unit;
    public UpdateProfileHistoryCommandHandler(IApplicantProfileRepository profiles, IUnitOfWork unit) { _profiles = profiles; _unit = unit; }
    public async Task<Result> Handle(UpdateProfileHistoryCommand request, CancellationToken ct)
    {
        var profile = await _profiles.GetByUserIdAsync(request.UserId, ct);
        if (profile is null) return Result.Failure("Applicant profile not found.");
        if (request.Educations.Count > 20 || request.Experiences.Count > 20) return Result.Failure("A profile can contain at most 20 education and experience entries.");
        profile.Educations.Clear(); profile.Experiences.Clear();
        foreach (var e in request.Educations) { if (string.IsNullOrWhiteSpace(e.Institution) || string.IsNullOrWhiteSpace(e.Degree) || e.StartYear is < 1900 or > 2200) return Result.Failure("Education entries are invalid."); profile.Educations.Add(new Education { Institution = e.Institution.Trim(), Degree = e.Degree.Trim(), FieldOfStudy = e.FieldOfStudy?.Trim() ?? string.Empty, StartYear = e.StartYear, EndYear = e.IsOngoing ? null : e.EndYear, IsOngoing = e.IsOngoing, Description = e.Description?.Trim() }); }
        foreach (var e in request.Experiences) { if (string.IsNullOrWhiteSpace(e.CompanyName) || string.IsNullOrWhiteSpace(e.Title) || e.StartDate > DateTime.UtcNow || (!e.IsCurrentPosition && e.EndDate < e.StartDate)) return Result.Failure("Experience entries are invalid."); profile.Experiences.Add(new Experience { CompanyName = e.CompanyName.Trim(), Title = e.Title.Trim(), StartDate = e.StartDate, EndDate = e.IsCurrentPosition ? null : e.EndDate, IsCurrentPosition = e.IsCurrentPosition, Description = e.Description?.Trim(), EmploymentType = e.EmploymentType?.Trim(), LocationDescription = e.LocationDescription?.Trim() }); }
        _profiles.Update(profile); await _unit.SaveChangesAsync(ct); return Result.Success();
    }
}
