using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using MiniErp.Api.Middlewares;
using MiniErp.Application.Validators;
using MiniErp.Infrastructure;
using MiniErp.Infrastructure.Persistence;

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

// Aplica migrations pendentes automaticamente ao iniciar. Necessário para o cenário
// Docker (docker compose up --build), onde não há passo manual de `dotnet ef database
// update` antes de subir o container. Não altera contratos nem regras de negócio.
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<MiniErpContext>();
    context.Database.Migrate();
}

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
