using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MiniErp.Application.Interfaces;
using MiniErp.Application.Services;
using MiniErp.Infrastructure.Persistence;

namespace MiniErp.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? "Data Source=minierp.db";

        services.AddDbContext<MiniErpContext>(options => options.UseSqlite(connectionString));

        services.AddScoped<IUnitOfWork, UnitOfWork>();

        services.AddScoped<IProdutoService, ProdutoService>();
        services.AddScoped<IClienteService, ClienteService>();
        services.AddScoped<IVendaService, VendaService>();
        services.AddScoped<IDashboardService, DashboardService>();

        return services;
    }
}
