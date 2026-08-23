using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TalentOS.Infrastructure.Persistence;

namespace TalentOS.API.Controllers;

/// <summary>
/// Health probes for uptime monitoring and load balancers. Both endpoints are anonymous so
/// orchestrators (and the frontend's offline detector) can reach them without a token.
/// </summary>
[AllowAnonymous]
public sealed class HealthController : BaseApiController
{
    private readonly TalentOSDbContext _dbContext;
    private readonly ILogger<HealthController> _logger;

    public HealthController(TalentOSDbContext dbContext, ILogger<HealthController> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <summary>Liveness probe — returns 200 as long as the API process is running.</summary>
    [HttpGet]
    [ProducesResponseType(200)]
    public IActionResult Get() => Ok(new
    {
        status = "healthy",
        service = "TalentOS.API"
    });

    /// <summary>Readiness probe — verifies the database is reachable. Returns 503 when it is not.</summary>
    [HttpGet("db")]
    [ProducesResponseType(200)]
    [ProducesResponseType(503)]
    public async Task<IActionResult> Database(CancellationToken ct)
    {
        try
        {
            var canConnect = await _dbContext.Database.CanConnectAsync(ct);
            if (canConnect)
            {
                return Ok(new { status = "healthy", database = "connected" });
            }

            _logger.LogWarning("Database readiness probe failed: CanConnect returned false.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Database readiness probe threw while checking connectivity.");
        }

        return StatusCode(StatusCodes.Status503ServiceUnavailable, new
        {
            status = "unhealthy",
            database = "unreachable"
        });
    }
}
