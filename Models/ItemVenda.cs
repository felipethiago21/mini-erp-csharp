namespace MiniErp.Models;

public class ItemVenda
{
    public int Id { get; set;}
    public Produto Produto { get; set; } = new();
    public int Quantidade { get; set; }

    public decimal Subtotal
    {
        get
        {
            return Produto.Preco * Quantidade;
        }
    }
}