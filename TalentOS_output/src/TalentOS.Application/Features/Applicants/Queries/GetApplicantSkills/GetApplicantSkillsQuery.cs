using MediatR;
using TalentOS.Application.Features.Applicants.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.Applicants.Queries.GetApplicantSkills;

public record GetApplicantSkillsQuery(Guid ApplicantId) : IRequest<Result<IReadOnlyList<ApplicantSkillResponse>>>;
