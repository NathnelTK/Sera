using System.Data.Common;
using System.Net;
using System.Net.Sockets;
using System.Text.Json;
using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TalentOS.Domain.Exceptions;

namespace TalentOS.API.Middleware;

/// <summary>
/// Translates unhandled exceptions into RFC 7807 <c>application/problem+json</c> responses with a
/// consistent shape, and maps infrastructure failures (database connectivity, timeouts) to
/// meaningful status codes so clients can react — retry, or show an offline/maintenance message.
/// </summary>
public sealed class GlobalExceptionMiddleware
{
    private static readonly JsonSerializerOptions SerializerOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;
    private readonly IHostEnvironment _environment;

    public GlobalExceptionMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionMiddleware> logger,
        IHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (OperationCanceledException) when (context.RequestAborted.IsCancellationRequested)
        {
            // The client disconnected or cancelled the request; there is nothing useful to return.
            _logger.LogDebug("Request to {Path} was cancelled by the client.", context.Request.Path);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning("Validation failed for {Path}: {Errors}", context.Request.Path, ex.Message);
            var errors = ex.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());
            await WriteValidationProblemAsync(context, errors);
        }
        catch (EntityNotFoundException ex)
        {
            _logger.LogInformation("Resource not found for {Path}: {Message}", context.Request.Path, ex.Message);
            await WriteProblemAsync(context, HttpStatusCode.NotFound, "Resource not found", ex.Message);
        }
        catch (UnauthorizedDomainException ex)
        {
            _logger.LogWarning("Forbidden access to {Path}: {Message}", context.Request.Path, ex.Message);
            await WriteProblemAsync(context, HttpStatusCode.Forbidden, "Forbidden", ex.Message);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning("Unauthenticated access to {Path}: {Message}", context.Request.Path, ex.Message);
            await WriteProblemAsync(context, HttpStatusCode.Unauthorized, "Authentication required",
                "You must be signed in to access this resource.");
        }
        catch (DomainException ex)
        {
            _logger.LogWarning("Domain rule violated for {Path}: {Message}", context.Request.Path, ex.Message);
            await WriteProblemAsync(context, HttpStatusCode.BadRequest, "Request could not be processed", ex.Message);
        }
        catch (Exception ex) when (IsDatabaseFailure(ex))
        {
            _logger.LogError(ex, "Database access failure while handling {Path}.", context.Request.Path);
            await WriteProblemAsync(context, HttpStatusCode.ServiceUnavailable, "Service temporarily unavailable",
                "The service could not reach the database. Please try again in a few moments.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception while handling {Path}.", context.Request.Path);
            var detail = _environment.IsDevelopment()
                ? ex.ToString()
                : "An unexpected error occurred. Please try again later.";
            await WriteProblemAsync(context, HttpStatusCode.InternalServerError, "Internal server error", detail);
        }
    }

    /// <summary>
    /// Walks the inner-exception chain looking for the signatures of a data-access or connectivity
    /// failure. We match on BCL types plus provider type names (Npgsql/Postgres/EF) so the API
    /// project does not need a direct compile-time dependency on the database provider.
    /// </summary>
    private static bool IsDatabaseFailure(Exception exception)
    {
        for (Exception? current = exception; current is not null; current = current.InnerException)
        {
            if (current is DbException or SocketException or TimeoutException)
            {
                return true;
            }

            var typeName = current.GetType().FullName ?? string.Empty;
            if (typeName.Contains("Npgsql", StringComparison.OrdinalIgnoreCase) ||
                typeName.Contains("Postgres", StringComparison.OrdinalIgnoreCase) ||
                typeName.Contains("DbUpdateException", StringComparison.OrdinalIgnoreCase) ||
                typeName.Contains("DbUpdateConcurrencyException", StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
        }

        return false;
    }

    private Task WriteProblemAsync(HttpContext context, HttpStatusCode status, string title, string detail)
    {
        var problem = new ProblemDetails
        {
            Status = (int)status,
            Title = title,
            Detail = detail,
            Instance = context.Request.Path
        };
        return WriteAsync(context, problem);
    }

    private Task WriteValidationProblemAsync(HttpContext context, IDictionary<string, string[]> errors)
    {
        var problem = new ValidationProblemDetails(errors)
        {
            Status = (int)HttpStatusCode.BadRequest,
            Title = "One or more validation errors occurred.",
            Instance = context.Request.Path
        };
        return WriteAsync(context, problem);
    }

    private async Task WriteAsync(HttpContext context, ProblemDetails problem)
    {
        // If the response has already begun streaming we cannot safely rewrite it.
        if (context.Response.HasStarted)
        {
            _logger.LogWarning("Response already started for {Path}; cannot write problem details.", context.Request.Path);
            return;
        }

        problem.Extensions["traceId"] = System.Diagnostics.Activity.Current?.Id ?? context.TraceIdentifier;

        context.Response.Clear();
        context.Response.StatusCode = problem.Status ?? StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/problem+json";

        // Serialize against the runtime type so ValidationProblemDetails.Errors is included.
        var json = JsonSerializer.Serialize(problem, problem.GetType(), SerializerOptions);
        await context.Response.WriteAsync(json);
    }
}
