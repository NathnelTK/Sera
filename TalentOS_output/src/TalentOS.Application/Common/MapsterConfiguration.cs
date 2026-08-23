using Mapster;
using TalentOS.Application.Features.Jobs.DTOs;
using TalentOS.Application.Features.Applications.DTOs;
using TalentOS.Application.Features.Applicants.DTOs;
using TalentOS.Application.Features.Recruiters.DTOs;
using TalentOS.Application.Features.Verification.DTOs;
using TalentOS.Application.Features.Interviews.DTOs;
using TalentOS.Application.Features.Notifications.DTOs;
using TalentOS.Domain.Entities;

namespace TalentOS.Application.Common;

public static class MapsterConfiguration
{
    public static void Configure()
    {
        TypeAdapterConfig<Job, JobSummaryResponse>.NewConfig()
            .Map(dest => dest.MinSalary, src => src.MinimumSalary)
            .Map(dest => dest.MaxSalary, src => src.MaximumSalary)
            .Map(dest => dest.Deadline, src => src.DeadlineAt)
            .Map(dest => dest.RecruiterName, src => src.Recruiter != null
                ? $"{src.Recruiter.FirstName} {src.Recruiter.LastName}"
                : string.Empty)
            .Map(dest => dest.CompanyName, src => src.Company != null ? src.Company.Name : null);

        TypeAdapterConfig<Job, JobDetailsResponse>.NewConfig()
            .Map(dest => dest.MinSalary, src => src.MinimumSalary)
            .Map(dest => dest.MaxSalary, src => src.MaximumSalary)
            .Map(dest => dest.Deadline, src => src.DeadlineAt)
            .Map(dest => dest.RecruiterName, src => src.Recruiter != null
                ? $"{src.Recruiter.FirstName} {src.Recruiter.LastName}"
                : string.Empty)
            .Map(dest => dest.CompanyName, src => src.Company != null ? src.Company.Name : null)
            .Map(dest => dest.ApplicationCount, src => src.Applications.Count);

        TypeAdapterConfig<ApplicantProfile, ApplicantProfileResponse>.NewConfig()
            .Map(dest => dest.Email, src => src.User != null ? src.User.Email : string.Empty);

        TypeAdapterConfig<RecruiterProfile, RecruiterProfileResponse>.NewConfig()
            .Map(dest => dest.Email, src => src.User != null ? src.User.Email : string.Empty)
            .Map(dest => dest.CompanyName, src => src.Company != null ? src.Company.Name : null);
    }
}
