using MiniErp.Application.DTOs.Produtos;
using MiniErp.Application.Exceptions;

namespace MiniErp.Tests;

public class ProdutoServiceTests
{
    [Fact]
    public async Task Cadastrar_ComDadosValidos_DevePersistirProduto()
    {
        var (_, unitOfWork) = TestUnitOfWorkFactory.Criar();
        var service = TestUnitOfWorkFactory.NovoProdutoService(unitOfWork);

        var produto = await service.CadastrarAsync(new CriarProdutoRequest
        {
            Nome = "Arroz",
            Preco = 20,
            EstoqueInicial = 10
        });

        Assert.True(produto.Id > 0);
        Assert.Equal("Arroz", produto.Nome);
        Assert.Equal(10, produto.QuantidadeEstoque);
    }

    [Fact]
    public async Task AdicionarEstoque_ComPrecoInvalido_DeveLancarValidationAppException()
    {
        var (_, unitOfWork) = TestUnitOfWorkFactory.Criar();
        var service = TestUnitOfWorkFactory.NovoProdutoService(unitOfWork);

        var produto = await service.CadastrarAsync(new CriarProdutoRequest
        {
            Nome = "Feijão",
            Preco = 10,
            EstoqueInicial = 5
        });

        await Assert.ThrowsAsync<ValidationAppException>(() =>
            service.AdicionarEstoqueAsync(produto.Id, new MovimentarEstoqueRequest { Quantidade = 0 }));
    }
}
