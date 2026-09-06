using MediatR;
using Microsoft.AspNetCore.Mvc;
using TalentOS.Domain.Common;

namespace TalentOS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    protected ISender Mediator => HttpContext.RequestServices.GetRequiredService<ISender>();

    protected IActionResult FromResult(Result result)
        => result.IsSuccess ? NoContent() : MapFailure(result.Error);

    protected IActionResult FromResult<T>(Result<T> result)
        => result.IsSuccess ? Ok(result.Value) : MapFailure(result.Error);

    protected IActionResult CreatedFromResult<T>(Result<Guid> result, string routeName, T response)
        => result.IsSuccess
            ? CreatedAtRoute(routeName, new { id = result.Value }, response)
            : MapFailure(result.Error);

    private IActionResult MapFailure(string? error)
    {
        var message = string.IsNullOrWhiteSpace(error) ? "The request could not be processed." : error;
        if (message.Contains("not found", StringComparison.OrdinalIgnoreCase))
            return NotFound(new { error = message });
        if (message.Contains("unauthorized", StringComparison.OrdinalIgnoreCase) ||
            message.Contains("authentication", StringComparison.OrdinalIgnoreCase))
            return Unauthorized(new { error = message });
        if (message.Contains("permission", StringComparison.OrdinalIgnoreCase) ||
            message.Contains("not authorized", StringComparison.OrdinalIgnoreCase) ||
            message.Contains("forbidden", StringComparison.OrdinalIgnoreCase))
            return StatusCode(StatusCodes.Status403Forbidden, new { error = message });
        return BadRequest(new { error = message });
    }
}
