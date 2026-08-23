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
        => result.IsSuccess ? NoContent() : BadRequest(new { error = result.Error });

    protected IActionResult FromResult<T>(Result<T> result)
        => result.IsSuccess ? Ok(result.Value) : BadRequest(new { error = result.Error });

    protected IActionResult CreatedFromResult<T>(Result<Guid> result, string routeName, T response)
        => result.IsSuccess
            ? CreatedAtRoute(routeName, new { id = result.Value }, response)
            : BadRequest(new { error = result.Error });
}
