using MiniErp.Application.DTOs.Dashboard;
using MiniErp.Application.DTOs.Produtos;
using MiniErp.Application.DTOs.Vendas;
using MiniErp.Application.Interfaces;

namespace MiniErp.Application.Services;

public class DashboardService(IUnitOfWork unitOfWork) : IDashboardService
{
    private const int LimiteEstoqueBaixo = 5;

    public async Task<DashboardResumoResponse> ObterResumoAsync(CancellationToken ct = default)
    {
        var totalProdutos = await unitOfWork.Produtos.ContarAsync(ct);
        var totalClientes = await unitOfWork.Clientes.ContarAsync(ct);
        var totalVendas = await unitOfWork.Vendas.ContarAsync(ct);
        var faturamentoTotal = await unitOfWork.Produtos.CalcularFaturamentoTotalAsync(ct);
        var estoqueBaixo = await unitOfWork.Produtos.ContarComEstoqueBaixoAsync(LimiteEstoqueBaixo, ct);
        var produtosMenorEstoque = await unitOfWork.Produtos.ObterMenorEstoqueAsync(5, ct);
        var vendasRecentes = await unitOfWork.Vendas.ObterMaisRecentesAsync(5, ct);

        return new DashboardResumoResponse
        {
            TotalProdutos = totalProdutos,
            TotalClientes = totalClientes,
            TotalVendas = totalVendas,
            FaturamentoTotal = faturamentoTotal,
            QuantidadeProdutosComEstoqueBaixo = estoqueBaixo,
            ProdutosComMenorEstoque = produtosMenorEstoque.Select(p => new ProdutoResponse
            {
                Id = p.Id,
                Nome = p.Nome,
                Preco = p.Preco,
                QuantidadeEstoque = p.QuantidadeEstoque
            }).ToList(),
            VendasMaisRecentes = vendasRecentes.Select(v => new VendaResponse
            {
                Id = v.Id,
                ClienteId = v.ClienteId,
                ClienteNome = v.Cliente.Nome,
                Data = v.Data,
                Total = v.Total,
                Itens = v.Itens.Select(i => new ItemVendaResponse
                {
                    ProdutoId = i.ProdutoId,
                    ProdutoNome = i.Produto.Nome,
                    Quantidade = i.Quantidade,
                    PrecoUnitario = i.PrecoUnitario,
                    Subtotal = i.Subtotal
                }).ToList()
            }).ToList()
        };
    }
}
