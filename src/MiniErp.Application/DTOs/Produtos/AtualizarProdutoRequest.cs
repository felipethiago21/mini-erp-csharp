namespace MiniErp.Application.DTOs.Produtos;

public class AtualizarProdutoRequest
{
    public string Nome { get; set; } = string.Empty;
    public decimal Preco { get; set; }
}
