namespace MiniErp.Domain.Entities;

public class Venda
{
    public int Id { get; set; }

    public int ClienteId { get; set; }
    
    public Cliente Cliente { get; set; } = null!;

    public DateTime Data { get; set; }

    public List<ItemVenda> Itens { get; set; } = [];

    public decimal Total
    {
        get
        {
            return Itens.Sum(item => item.Subtotal);
        }
    }
}