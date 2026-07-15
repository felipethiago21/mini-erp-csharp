using MiniErp.Application.DTOs.Produtos;
using MiniErp.Application.DTOs.Vendas;

namespace MiniErp.Application.DTOs.Dashboard;

public class DashboardResumoResponse
{
    public int TotalProdutos { get; set; }
    public int TotalClientes { get; set; }
    public int TotalVendas { get; set; }
    public decimal FaturamentoTotal { get; set; }
    public int QuantidadeProdutosComEstoqueBaixo { get; set; }
    public List<ProdutoResponse> ProdutosComMenorEstoque { get; set; } = [];
    public List<VendaResponse> VendasMaisRecentes { get; set; } = [];
}
