using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using MiniErp.Application.Interfaces;
using MiniErp.Application.Services;
using MiniErp.Infrastructure.Persistence;

namespace MiniErp.Tests;

public static class TestUnitOfWorkFactory {
    public static (MiniErpContext Context, IUnitOfWork UnitOfWork) Criar() {
        var connection = new SqliteConnection("Data Source=:memory:");
        connection.Open();

        var options = new DbContextOptionsBuilder<MiniErpContext>()
            .UseSqlite(connection)
            .Options;

        var context = new MiniErpContext(options);
        context.Database.EnsureCreated();

        return (context, new UnitOfWork(context));
    }

    public static ProdutoService NovoProdutoService(IUnitOfWork unitOfWork) =>
        new(unitOfWork, NullLogger<ProdutoService>.Instance);

    public static VendaService NovaVendaService(IUnitOfWork unitOfWork) =>
        new(unitOfWork, NullLogger<VendaService>.Instance);
}
