using MiniErp.Data;
using MiniErp.Models;

namespace MiniErp.Services;

public class ProdutoService
{
    // Representa o acesso ao banco de dados.
    private readonly MiniErpContext _context;

    // Recebe o contexto criado no Program.cs.
    public ProdutoService(MiniErpContext context)
    {
        _context = context;
    }

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
            Nome = nome,
            Preco = preco,
            QuantidadeEstoque = estoqueInicial
        };

        // Prepara o INSERT.
        _context.Produtos.Add(produto);

        // Executa o INSERT no SQLite.
        _context.SaveChanges();

        return produto;
    }

    public List<Produto> Listar()
    {
        // SELECT de todos os produtos.
        return _context.Produtos.ToList();
    }

    public Produto? BuscarPorId(int id)
    {
        // SELECT procurando o primeiro produto com o ID informado.
        return _context.Produtos.FirstOrDefault(produto => produto.Id == id);
    }

    public void AdicionarEstoque(int id, int quantidade)
    {
        var produto = BuscarPorId(id);

        if (produto == null)
            throw new InvalidOperationException("Produto não encontrado.");

        produto.AdicionarEstoque(quantidade);

        // Executa o UPDATE no banco.
        _context.SaveChanges();
    }

    public void RemoverEstoque(int id, int quantidade)
    {
        var produto = BuscarPorId(id);

        if (produto == null)
            throw new InvalidOperationException("Produto não encontrado.");

        produto.RemoverEstoque(quantidade);

        _context.SaveChanges();
    }

    public void Excluir(int id)
    {
        var produto = BuscarPorId(id);

        if (produto == null)
            throw new InvalidOperationException("Produto não encontrado.");

        // Prepara o DELETE.
        _context.Produtos.Remove(produto);

        // Executa o DELETE.
        _context.SaveChanges();
    }
}