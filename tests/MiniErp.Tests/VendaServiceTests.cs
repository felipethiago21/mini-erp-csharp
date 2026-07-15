using MiniErp.Application.DTOs.Clientes;
using MiniErp.Application.DTOs.Produtos;
using MiniErp.Application.DTOs.Vendas;
using MiniErp.Application.Exceptions;
using MiniErp.Application.Services;

namespace MiniErp.Tests;

public class VendaServiceTests
{
    [Fact]
    public async Task Registrar_ComEstoqueSuficiente_DeveRegistrarVendaEReduzirEstoque()
    {
        var (_, unitOfWork) = TestUnitOfWorkFactory.Criar();
        var produtoService = TestUnitOfWorkFactory.NovoProdutoService(unitOfWork);
        var vendaService = TestUnitOfWorkFactory.NovaVendaService(unitOfWork);
        var clienteService = new ClienteService(unitOfWork, Microsoft.Extensions.Logging.Abstractions.NullLogger<ClienteService>.Instance);

        var cliente = await clienteService.CadastrarAsync(new CriarClienteRequest { Nome = "João", Email = "joao@teste.com" });
        var produto = await produtoService.CadastrarAsync(new CriarProdutoRequest { Nome = "Arroz", Preco = 20, EstoqueInicial = 10 });

        var venda = await vendaService.RegistrarAsync(new CriarVendaRequest
        {
            ClienteId = cliente.Id,
            Itens = [new CriarItemVendaRequest { ProdutoId = produto.Id, Quantidade = 3 }]
        });

        Assert.Equal(60, venda.Total);

        var produtoAtualizado = await produtoService.ObterPorIdAsync(produto.Id);
        Assert.Equal(7, produtoAtualizado.QuantidadeEstoque);
    }

    [Fact]
    public async Task Registrar_ComEstoqueInsuficiente_DeveLancarConflictExceptionSemAlterarEstoque()
    {
        var (_, unitOfWork) = TestUnitOfWorkFactory.Criar();
        var produtoService = TestUnitOfWorkFactory.NovoProdutoService(unitOfWork);
        var vendaService = TestUnitOfWorkFactory.NovaVendaService(unitOfWork);
        var clienteService = new ClienteService(unitOfWork, Microsoft.Extensions.Logging.Abstractions.NullLogger<ClienteService>.Instance);

        var cliente = await clienteService.CadastrarAsync(new CriarClienteRequest { Nome = "Maria", Email = "maria@teste.com" });
        var produto = await produtoService.CadastrarAsync(new CriarProdutoRequest { Nome = "Feijão", Preco = 8, EstoqueInicial = 2 });

        await Assert.ThrowsAsync<ConflictException>(() => vendaService.RegistrarAsync(new CriarVendaRequest
        {
            ClienteId = cliente.Id,
            Itens = [new CriarItemVendaRequest { ProdutoId = produto.Id, Quantidade = 5 }]
        }));

        var produtoAtualizado = await produtoService.ObterPorIdAsync(produto.Id);
        Assert.Equal(2, produtoAtualizado.QuantidadeEstoque);
    }

    [Fact]
    public async Task Registrar_ComUmItemInvalido_DeveFazerRollbackDeTodosOsItens()
    {
        var (_, unitOfWork) = TestUnitOfWorkFactory.Criar();
        var produtoService = TestUnitOfWorkFactory.NovoProdutoService(unitOfWork);
        var vendaService = TestUnitOfWorkFactory.NovaVendaService(unitOfWork);
        var clienteService = new ClienteService(unitOfWork, Microsoft.Extensions.Logging.Abstractions.NullLogger<ClienteService>.Instance);

        var cliente = await clienteService.CadastrarAsync(new CriarClienteRequest { Nome = "Pedro", Email = "pedro@teste.com" });
        var produtoValido = await produtoService.CadastrarAsync(new CriarProdutoRequest { Nome = "Arroz", Preco = 20, EstoqueInicial = 10 });
        var produtoSemEstoque = await produtoService.CadastrarAsync(new CriarProdutoRequest { Nome = "Feijão", Preco = 8, EstoqueInicial = 1 });

        await Assert.ThrowsAsync<ConflictException>(() => vendaService.RegistrarAsync(new CriarVendaRequest
        {
            ClienteId = cliente.Id,
            Itens =
            [
                new CriarItemVendaRequest { ProdutoId = produtoValido.Id, Quantidade = 2 },
                new CriarItemVendaRequest { ProdutoId = produtoSemEstoque.Id, Quantidade = 10 }
            ]
        }));

        var vendas = await vendaService.ListarAsync();
        Assert.Empty(vendas);

        var produtoValidoAtualizado = await produtoService.ObterPorIdAsync(produtoValido.Id);
        Assert.Equal(10, produtoValidoAtualizado.QuantidadeEstoque);
    }

    [Fact]
    public async Task Registrar_ComClienteInexistente_DeveLancarNotFoundException()
    {
        var (_, unitOfWork) = TestUnitOfWorkFactory.Criar();
        var produtoService = TestUnitOfWorkFactory.NovoProdutoService(unitOfWork);
        var vendaService = TestUnitOfWorkFactory.NovaVendaService(unitOfWork);

        var produto = await produtoService.CadastrarAsync(new CriarProdutoRequest { Nome = "Arroz", Preco = 20, EstoqueInicial = 10 });

        await Assert.ThrowsAsync<NotFoundException>(() => vendaService.RegistrarAsync(new CriarVendaRequest
        {
            ClienteId = 999,
            Itens = [new CriarItemVendaRequest { ProdutoId = produto.Id, Quantidade = 1 }]
        }));
    }
}
