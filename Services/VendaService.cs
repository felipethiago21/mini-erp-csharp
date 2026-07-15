using MiniErp.Models;

namespace MiniErp.Services;

public class VendaService
{
    private readonly List<Venda> _vendas = [];
    private int _proximoId = 1;

    public Venda Registrar(
        Cliente cliente,
        Produto produto,
        int quantidade)
    {
        if (quantidade <= 0)
            throw new ArgumentException("A quantidade deve ser maior que zero.");

        if (!produto.TemEstoque(quantidade))
            throw new InvalidOperationException("Estoque insuficiente.");

        produto.RemoverEstoque(quantidade);

        var item = new ItemVenda
        {
            Produto = produto,
            Quantidade = quantidade
        };

        var venda = new Venda
        {
            Id = _proximoId++,
            Cliente = cliente,
            Data = DateTime.Now,
            Itens = [item]
        };

        _vendas.Add(venda);

        return venda;
    }

    public List<Venda> Listar()
    {
        return _vendas;
    }
}