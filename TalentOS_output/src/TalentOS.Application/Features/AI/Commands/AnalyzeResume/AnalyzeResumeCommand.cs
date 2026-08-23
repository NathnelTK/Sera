using MediatR;
using TalentOS.Application.Features.AI.DTOs;
using TalentOS.Domain.Common;

namespace TalentOS.Application.Features.AI.Commands.AnalyzeResume;

public record AnalyzeResumeCommand(string ResumeText) : IRequest<Result<ResumeAnalysisResponse>>;
