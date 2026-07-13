using MiniErp.Services;

var produtoService = new ProdutoService();

Console.Write("Digite o nome do produto: ");
var nome = Console.ReadLine();

Console.Write("Digite o preço do produto: ");
var preco = Console.ReadLine();

Console.Write("Digite o Estoque do produto: ");
var estoque = Console.ReadLine();

var produtoCadastrado = produtoService.Cadastrar(
    nome ?? string.Empty,
    decimal.Parse(preco ?? "0"),
    int.Parse(estoque ?? "0")
);

Console.WriteLine();
Console.WriteLine($"Produto: {produtoCadastrado.Nome}");
Console.WriteLine($"Preço: {produtoCadastrado.Preco:C}");
Console.WriteLine($"Estoque: {produtoCadastrado.QuantidadeEstoque}");