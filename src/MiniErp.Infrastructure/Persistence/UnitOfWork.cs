using MiniErp.Application.Interfaces;
using MiniErp.Infrastructure.Repositories;

namespace MiniErp.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly MiniErpContext _context;

    public UnitOfWork(MiniErpContext context)
    {
        _context = context;
        Produtos = new ProdutoRepository(context);
        Clientes = new ClienteRepository(context);
        Vendas = new VendaRepository(context);
    }

    public IProdutoRepository Produtos { get; }
    public IClienteRepository Clientes { get; }
    public IVendaRepository Vendas { get; }

    public Task<int> SalvarAsync(CancellationToken ct = default) => _context.SaveChangesAsync(ct);

    public async Task ExecutarEmTransacaoAsync(Func<Task> operacao, CancellationToken ct = default)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync(ct);

        try
        {
            await operacao();
            await transaction.CommitAsync(ct);
        }
        catch
        {
            await transaction.RollbackAsync(ct);
            _context.ChangeTracker.Clear();
            throw;
        }
    }
}
