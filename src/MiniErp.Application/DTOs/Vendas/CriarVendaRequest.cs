namespace MiniErp.Application.DTOs.Vendas;

public class CriarVendaRequest
{
    public int ClienteId { get; set; }
    public List<CriarItemVendaRequest> Itens { get; set; } = [];
}
