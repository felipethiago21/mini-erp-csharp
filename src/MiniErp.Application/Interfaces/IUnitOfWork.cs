namespace MiniErp.Application.Interfaces;

public interface IUnitOfWork
{
    IProdutoRepository Produtos { get; }
    IClienteRepository Clientes { get; }
    IVendaRepository Vendas { get; }

    Task<int> SalvarAsync(CancellationToken ct = default);

    Task ExecutarEmTransacaoAsync(Func<Task> operacao, CancellationToken ct = default);
}
