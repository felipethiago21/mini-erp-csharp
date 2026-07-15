using Microsoft.EntityFrameworkCore;
using MiniErp.Application.Interfaces;
using MiniErp.Domain.Entities;
using MiniErp.Infrastructure.Persistence;

namespace MiniErp.Infrastructure.Repositories;

public class ProdutoRepository(MiniErpContext context) : IProdutoRepository
{
    public Task<Produto?> ObterPorIdAsync(int id, CancellationToken ct = default) =>
        context.Produtos.FirstOrDefaultAsync(p => p.Id == id, ct);

    public async Task<(List<Produto> Itens, int TotalItens)> ListarAsync(
        string? busca, int pagina, int tamanhoPagina, CancellationToken ct = default)
    {
        var query = context.Produtos.AsQueryable();

        if (!string.IsNullOrWhiteSpace(busca))
            query = query.Where(p => EF.Functions.Like(p.Nome, $"%{busca}%"));

        var total = await query.CountAsync(ct);

        var itens = await query
            .OrderBy(p => p.Id)
            .Skip((pagina - 1) * tamanhoPagina)
            .Take(tamanhoPagina)
            .ToListAsync(ct);

        return (itens, total);
    }

    public async Task<List<Produto>> ObterMenorEstoqueAsync(int quantidade, CancellationToken ct = default) =>
        await context.Produtos
            .OrderBy(p => p.QuantidadeEstoque)
            .Take(quantidade)
            .ToListAsync(ct);

    public Task<int> ContarAsync(CancellationToken ct = default) =>
        context.Produtos.CountAsync(ct);

    public Task<decimal> CalcularFaturamentoTotalAsync(CancellationToken ct = default) =>
        context.ItensVenda.SumAsync(i => i.PrecoUnitario * i.Quantidade, ct);

    public Task<int> ContarComEstoqueBaixoAsync(int limite, CancellationToken ct = default) =>
        context.Produtos.CountAsync(p => p.QuantidadeEstoque <= limite, ct);

    public void Adicionar(Produto produto) => context.Produtos.Add(produto);

    public void Remover(Produto produto) => context.Produtos.Remove(produto);
}
