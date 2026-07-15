using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MiniErp.Application.DTOs.Clientes;
using MiniErp.Application.DTOs.Common;
using MiniErp.Application.DTOs.Produtos;
using MiniErp.Application.DTOs.Vendas;
using MiniErp.Application.Interfaces;
using MiniErp.Infrastructure;

var builder = Host.CreateApplicationBuilder(args);
builder.Configuration.AddInMemoryCollection(new Dictionary<string, string?>
{
    ["ConnectionStrings:DefaultConnection"] = "Data Source=minierp.db"
});
builder.Services.AddInfrastructure(builder.Configuration);

using var host = builder.Build();

var produtoService = host.Services.GetRequiredService<IProdutoService>();
var clienteService = host.Services.GetRequiredService<IClienteService>();
var vendaService = host.Services.GetRequiredService<IVendaService>();

bool executando = true;

while (executando)
{
    Console.Clear();

    Console.WriteLine("================================");
    Console.WriteLine("            MINI ERP");
    Console.WriteLine("================================");
    Console.WriteLine("1 - Cadastrar Produto");
    Console.WriteLine("2 - Listar Produtos");
    Console.WriteLine("3 - Buscar Produto");
    Console.WriteLine("4 - Entrada de Estoque");
    Console.WriteLine("5 - Saída de Estoque");
    Console.WriteLine("6 - Excluir Produto");
    Console.WriteLine("7 - Cadastrar Cliente");
    Console.WriteLine("8 - Listar Clientes");
    Console.WriteLine("9 - Registrar Venda");
    Console.WriteLine("10 - Listar Vendas");
    Console.WriteLine("0 - Sair");
    Console.WriteLine();
    Console.Write("Escolha uma opção: ");

    var opcao = Console.ReadLine();

    try
    {
        switch (opcao)
        {
            case "1":
                CadastrarProduto();
                break;

            case "2":
                ListarProdutos();
                break;

            case "3":
                BuscarProduto();
                break;

            case "4":
                EntradaEstoque();
                break;

            case "5":
                SaidaEstoque();
                break;

            case "6":
                ExcluirProduto();
                break;

            case "7":
                CadastrarCliente();
                break;

            case "8":
                ListarClientes();
                break;

            case "9":
                RegistrarVenda();
                break;

            case "10":
                ListarVendas();
                break;

            case "0":
                executando = false;
                break;

            default:
                Console.WriteLine("Opção inválida.");
                Pausar();
                break;
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine();
        Console.WriteLine($"Erro: {ex.Message}");
        Pausar();
    }
}

void CadastrarProduto()
{
    Console.Clear();

    Console.Write("Nome: ");
    var nome = Console.ReadLine();

    Console.Write("Preço: ");
    var preco = decimal.Parse(Console.ReadLine() ?? "0");

    Console.Write("Estoque inicial: ");
    var estoque = int.Parse(Console.ReadLine() ?? "0");

    var produto = produtoService.CadastrarAsync(new CriarProdutoRequest
    {
        Nome = nome ?? string.Empty,
        Preco = preco,
        EstoqueInicial = estoque
    }).GetAwaiter().GetResult();

    Console.WriteLine();
    Console.WriteLine($"Produto {produto.Nome} cadastrado com sucesso.");

    Pausar();
}

void ListarProdutos()
{
    Console.Clear();

    var produtos = produtoService.ListarAsync(new PaginacaoRequest { TamanhoPagina = 100 })
        .GetAwaiter().GetResult().Itens;

    if (produtos.Count == 0)
    {
        Console.WriteLine("Nenhum produto cadastrado.");
        Pausar();
        return;
    }

    foreach (var produto in produtos)
    {
        Console.WriteLine("------------------------------");
        Console.WriteLine($"ID      : {produto.Id}");
        Console.WriteLine($"Nome    : {produto.Nome}");
        Console.WriteLine($"Preço   : {produto.Preco:C}");
        Console.WriteLine($"Estoque : {produto.QuantidadeEstoque}");
    }

    Pausar();
}

void BuscarProduto()
{
    Console.Clear();

    Console.Write("Digite o ID do produto: ");
    var id = int.Parse(Console.ReadLine() ?? "0");

    var produto = produtoService.ObterPorIdAsync(id).GetAwaiter().GetResult();

    Console.WriteLine();
    Console.WriteLine($"Nome    : {produto.Nome}");
    Console.WriteLine($"Preço   : {produto.Preco:C}");
    Console.WriteLine($"Estoque : {produto.QuantidadeEstoque}");

    Pausar();
}

void EntradaEstoque()
{
    Console.Clear();

    Console.Write("ID do produto: ");
    var id = int.Parse(Console.ReadLine() ?? "0");

    Console.Write("Quantidade de entrada: ");
    var quantidade = int.Parse(Console.ReadLine() ?? "0");

    produtoService.AdicionarEstoqueAsync(id, new MovimentarEstoqueRequest { Quantidade = quantidade })
        .GetAwaiter().GetResult();

    Console.WriteLine("Estoque atualizado com sucesso.");

    Pausar();
}

void SaidaEstoque()
{
    Console.Clear();

    Console.Write("ID do produto: ");
    var id = int.Parse(Console.ReadLine() ?? "0");

    Console.Write("Quantidade de saída: ");
    var quantidade = int.Parse(Console.ReadLine() ?? "0");

    produtoService.RemoverEstoqueAsync(id, new MovimentarEstoqueRequest { Quantidade = quantidade })
        .GetAwaiter().GetResult();

    Console.WriteLine("Saída de estoque realizada com sucesso.");

    Pausar();
}

void ExcluirProduto()
{
    Console.Clear();

    Console.Write("ID do produto: ");
    var id = int.Parse(Console.ReadLine() ?? "0");

    produtoService.ExcluirAsync(id).GetAwaiter().GetResult();

    Console.WriteLine("Produto excluído com sucesso.");

    Pausar();
}

void CadastrarCliente()
{
    Console.Clear();

    Console.Write("Nome: ");
    var nome = Console.ReadLine();

    Console.Write("E-mail: ");
    var email = Console.ReadLine();

    var cliente = clienteService.CadastrarAsync(new CriarClienteRequest
    {
        Nome = nome ?? string.Empty,
        Email = email ?? string.Empty
    }).GetAwaiter().GetResult();

    Console.WriteLine();
    Console.WriteLine($"Cliente {cliente.Nome} cadastrado com sucesso.");

    Pausar();
}

void ListarClientes()
{
    Console.Clear();

    var clientes = clienteService.ListarAsync(new PaginacaoRequest { TamanhoPagina = 100 })
        .GetAwaiter().GetResult().Itens;

    if (clientes.Count == 0)
    {
        Console.WriteLine("Nenhum cliente cadastrado.");
        Pausar();
        return;
    }

    foreach (var cliente in clientes)
    {
        Console.WriteLine("------------------------------");
        Console.WriteLine($"ID    : {cliente.Id}");
        Console.WriteLine($"Nome  : {cliente.Nome}");
        Console.WriteLine($"E-mail: {cliente.Email}");
    }

    Pausar();
}

void RegistrarVenda()
{
    Console.Clear();

    Console.Write("ID do cliente: ");
    var clienteId = int.Parse(Console.ReadLine() ?? "0");

    Console.Write("ID do produto: ");
    var produtoId = int.Parse(Console.ReadLine() ?? "0");

    Console.Write("Quantidade: ");
    var quantidade = int.Parse(Console.ReadLine() ?? "0");

    var venda = vendaService.RegistrarAsync(new CriarVendaRequest
    {
        ClienteId = clienteId,
        Itens = [new CriarItemVendaRequest { ProdutoId = produtoId, Quantidade = quantidade }]
    }).GetAwaiter().GetResult();

    Console.WriteLine();
    Console.WriteLine("Venda registrada com sucesso!");
    Console.WriteLine($"Venda   : {venda.Id}");
    Console.WriteLine($"Cliente : {venda.ClienteNome}");
    Console.WriteLine($"Total   : {venda.Total:C}");

    Pausar();
}

void ListarVendas()
{
    Console.Clear();

    var vendas = vendaService.ListarAsync().GetAwaiter().GetResult();

    if (vendas.Count == 0)
    {
        Console.WriteLine("Nenhuma venda registrada.");
        Pausar();
        return;
    }

    foreach (var venda in vendas)
    {
        Console.WriteLine("------------------------------");
        Console.WriteLine($"Venda   : {venda.Id}");
        Console.WriteLine($"Data    : {venda.Data}");
        Console.WriteLine($"Cliente : {venda.ClienteNome}");
        Console.WriteLine($"Total   : {venda.Total:C}");

        foreach (var item in venda.Itens)
        {
            Console.WriteLine(
                $"Produto: {item.ProdutoNome} | " +
                $"Qtd: {item.Quantidade} | " +
                $"Subtotal: {item.Subtotal:C}"
            );
        }
    }

    Pausar();
}

void Pausar()
{
    Console.WriteLine();
    Console.Write("Pressione ENTER para continuar...");
    Console.ReadLine();
}
