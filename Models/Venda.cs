namespace MiniErp.Models;

public class Venda
{
    public int Id { get; set; }
    public Cliente Cliente { get; set; } = new();
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