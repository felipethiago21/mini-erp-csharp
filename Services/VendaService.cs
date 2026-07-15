using Microsoft.EntityFrameworkCore;
using MiniErp.Data;
using MiniErp.Models;

namespace MiniErp.Services;

public class VendaService
{
    private readonly MiniErpContext _context;

    public VendaService(MiniErpContext context)
    {
        _context = context;
    }

    public Venda Registrar(
        Cliente cliente,
        Produto produto,
        int quantidade)
    {
        if (quantidade <= 0)
            throw new ArgumentException("A quantidade deve ser maior que zero.");

        if (!produto.TemEstoque(quantidade))
            throw new InvalidOperationException("Estoque insuficiente.");

        // Dá baixa no estoque
        produto.RemoverEstoque(quantidade);

       var item = new ItemVenda
            {
                ProdutoId = produto.Id,
                Produto = produto,
                Quantidade = quantidade,
                PrecoUnitario = produto.Preco
            };

        var venda = new Venda
            {
                ClienteId = cliente.Id,
                Cliente = cliente,
                Data = DateTime.Now,
                Itens = [item]
            };

        _context.Vendas.Add(venda);

        // Salva a venda, item da venda e atualização do estoque
        _context.SaveChanges();

        return venda;
    }

    public List<Venda> Listar()
    {
        return _context.Vendas
            .Include(v => v.Cliente)
            .Include(v => v.Itens)
                .ThenInclude(i => i.Produto)
            .ToList();
    }

    public Venda? BuscarPorId(int id)
    {
        return _context.Vendas
            .Include(v => v.Cliente)
            .Include(v => v.Itens)
                .ThenInclude(i => i.Produto)
            .FirstOrDefault(v => v.Id == id);
    }
}