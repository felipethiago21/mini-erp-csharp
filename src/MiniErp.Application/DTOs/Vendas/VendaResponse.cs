namespace MiniErp.Application.DTOs.Vendas;

public class VendaResponse
{
    public int Id { get; set; }
    public int ClienteId { get; set; }
    public string ClienteNome { get; set; } = string.Empty;
    public DateTime Data { get; set; }
    public decimal Total { get; set; }
    public List<ItemVendaResponse> Itens { get; set; } = [];
}
