using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.OpenApi;
using MiniErp.Api.Middlewares;
using MiniErp.Application.Validators;
using MiniErp.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

const string corsPolicy = "MiniErpFrontend";

builder.Services.AddControllers();

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CriarProdutoRequestValidator>();

builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Mini ERP API",
        Version = "v1",
        Description = "API REST do Mini ERP: produtos, clientes, vendas e dashboard."
    });
});

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicy, policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Mini ERP API v1");
});

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();

app.UseCors(corsPolicy);

app.UseAuthorization();

app.MapControllers();

app.Run();
