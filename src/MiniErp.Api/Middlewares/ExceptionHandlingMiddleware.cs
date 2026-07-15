using System.Net;
using System.Text.Json;
using FluentValidation;
using MiniErp.Application.Exceptions;

namespace MiniErp.Api.Middlewares;

public class ErroResponse
{
    public int Status { get; set; }
    public string Erro { get; set; } = string.Empty;
    public object? Detalhes { get; set; }
}

public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await TratarAsync(context, ex);
        }
    }

    private async Task TratarAsync(HttpContext context, Exception exception)
    {
        var (status, erro, detalhes) = exception switch
        {
            ValidationException validationException => (
                HttpStatusCode.BadRequest,
                "Dados inválidos.",
                (object?)validationException.Errors.Select(e => e.ErrorMessage)),

            ValidationAppException validationAppException => (
                HttpStatusCode.BadRequest,
                validationAppException.Message,
                null),

            NotFoundException notFoundException => (
                HttpStatusCode.NotFound,
                notFoundException.Message,
                null),

            ConflictException conflictException => (
                HttpStatusCode.Conflict,
                conflictException.Message,
                null),

            ArgumentException argumentException => (
                HttpStatusCode.BadRequest,
                argumentException.Message,
                null),

            _ => (HttpStatusCode.InternalServerError, "Ocorreu um erro inesperado.", (object?)null)
        };

        if (status == HttpStatusCode.InternalServerError)
            logger.LogError(exception, "Erro inesperado ao processar {Path}", context.Request.Path);
        else
            logger.LogWarning("Erro de negócio ao processar {Path}: {Mensagem}", context.Request.Path, exception.Message);

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)status;

        var response = new ErroResponse
        {
            Status = (int)status,
            Erro = erro,
            Detalhes = detalhes
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
