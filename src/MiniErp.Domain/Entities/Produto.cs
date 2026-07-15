namespace MiniErp.Domain.Entities;

public class Produto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal Preco { get; set; }
    public int QuantidadeEstoque { get; set; }

    public bool TemEstoque(int quantidade)
    {
        return QuantidadeEstoque >= quantidade;
    }

    public void AdicionarEstoque(int quantidade)
    {
        if (quantidade <= 0)
            throw new ArgumentException("A quantidade deve ser maior que zero.");

        QuantidadeEstoque += quantidade;
    }

    public void RemoverEstoque(int quantidade)
    {
        if (quantidade <= 0)
            throw new ArgumentException("A quantidade deve ser maior que zero.");

        if (!TemEstoque(quantidade))
            throw new InvalidOperationException("Estoque insuficiente.");

        QuantidadeEstoque -= quantidade;
    }
}