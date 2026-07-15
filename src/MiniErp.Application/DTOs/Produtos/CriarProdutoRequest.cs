namespace MiniErp.Application.DTOs.Produtos;

public class CriarProdutoRequest
{
    public string Nome { get; set; } = string.Empty;
    public decimal Preco { get; set; }
    public int EstoqueInicial { get; set; }
}
