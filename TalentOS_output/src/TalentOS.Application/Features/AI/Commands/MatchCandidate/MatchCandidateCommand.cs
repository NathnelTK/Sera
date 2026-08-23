using MediatR;
using TalentOS.Application.Features.AI.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.AI.Commands.MatchCandidate;

public record MatchCandidateCommand(string ResumeText, string JobDescription) : IRequest<Result<CandidateMatchResponse>>;
