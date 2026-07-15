using MiniErp.Domain.Entities;

namespace MiniErp.Application.Interfaces;

public interface IProdutoRepository
{
    Task<Produto?> ObterPorIdAsync(int id, CancellationToken ct = default);

    Task<(List<Produto> Itens, int TotalItens)> ListarAsync(
        string? busca,
        int pagina,
        int tamanhoPagina,
        CancellationToken ct = default);

    Task<List<Produto>> ObterMenorEstoqueAsync(int quantidade, CancellationToken ct = default);

    Task<int> ContarAsync(CancellationToken ct = default);

    Task<decimal> CalcularFaturamentoTotalAsync(CancellationToken ct = default);

    Task<int> ContarComEstoqueBaixoAsync(int limite, CancellationToken ct = default);

    void Adicionar(Produto produto);

    void Remover(Produto produto);
}
