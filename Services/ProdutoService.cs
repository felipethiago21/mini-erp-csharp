using MiniErp.Models;

namespace MiniErp.Services;

public class ProdutoService
{
    private readonly List<Produto> _produtos = [];
    private int _proximoId = 1;

    public Produto Cadastrar(string nome, decimal preco, int estoqueInicial)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("O nome é obrigatório.");

        if (preco <= 0)
            throw new ArgumentException("O preço deve ser maior que zero.");

        if (estoqueInicial < 0)
            throw new ArgumentException("O estoque não pode ser negativo.");

        var produto = new Produto
        {
            Id = _proximoId++,
            Nome = nome,
            Preco = preco,
            QuantidadeEstoque = estoqueInicial
        };

        _produtos.Add(produto);

        return produto;
    }

    public List<Produto> Listar()
    {
        return _produtos;
    }

    public Produto? BuscarPorId(int id)
    {
        return _produtos.FirstOrDefault(produto => produto.Id == id);
    }

    public void AdicionarEstoque(int id, int quantidade)
    {
        var produto = BuscarPorId(id);

        if (produto == null)
            throw new InvalidOperationException("Produto não encontrado.");

        produto.AdicionarEstoque(quantidade);
    }

    public void RemoverEstoque(int id, int quantidade)
    {
        var produto = BuscarPorId(id);

        if (produto == null)
            throw new InvalidOperationException("Produto não encontrado.");

        produto.RemoverEstoque(quantidade);
    }

    public void Excluir(int id)
    {
        var produto = BuscarPorId(id);

        if (produto == null)
            throw new InvalidOperationException("Produto não encontrado.");

        _produtos.Remove(produto);
    }
}