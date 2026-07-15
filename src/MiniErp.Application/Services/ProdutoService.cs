using Microsoft.Extensions.Logging;
using MiniErp.Application.DTOs.Common;
using MiniErp.Application.DTOs.Produtos;
using MiniErp.Application.Exceptions;
using MiniErp.Application.Interfaces;
using MiniErp.Domain.Entities;

namespace MiniErp.Application.Services;

public class ProdutoService(IUnitOfWork unitOfWork, ILogger<ProdutoService> logger) : IProdutoService
{
    public async Task<ProdutoResponse> CadastrarAsync(CriarProdutoRequest request, CancellationToken ct = default)
    {
        var produto = new Produto
        {
            Nome = request.Nome,
            Preco = request.Preco,
            QuantidadeEstoque = request.EstoqueInicial
        };

        unitOfWork.Produtos.Adicionar(produto);
        await unitOfWork.SalvarAsync(ct);

        logger.LogInformation("Produto {ProdutoId} cadastrado", produto.Id);

        return MapearResponse(produto);
    }

    public async Task<PaginatedResponse<ProdutoResponse>> ListarAsync(PaginacaoRequest request, CancellationToken ct = default)
    {
        var (itens, total) = await unitOfWork.Produtos.ListarAsync(request.Busca, request.Pagina, request.TamanhoPagina, ct);

        return new PaginatedResponse<ProdutoResponse>
        {
            Itens = itens.Select(MapearResponse).ToList(),
            Pagina = request.Pagina,
            TamanhoPagina = request.TamanhoPagina,
            TotalItens = total
        };
    }

    public async Task<ProdutoResponse> ObterPorIdAsync(int id, CancellationToken ct = default)
    {
        var produto = await ObterOuFalharAsync(id, ct);
        return MapearResponse(produto);
    }

    public async Task<ProdutoResponse> AtualizarAsync(int id, AtualizarProdutoRequest request, CancellationToken ct = default)
    {
        var produto = await ObterOuFalharAsync(id, ct);

        produto.Nome = request.Nome;
        produto.Preco = request.Preco;

        await unitOfWork.SalvarAsync(ct);

        return MapearResponse(produto);
    }

    public async Task ExcluirAsync(int id, CancellationToken ct = default)
    {
        var produto = await ObterOuFalharAsync(id, ct);

        unitOfWork.Produtos.Remover(produto);
        await unitOfWork.SalvarAsync(ct);

        logger.LogInformation("Produto {ProdutoId} excluído", id);
    }

    public async Task<ProdutoResponse> AdicionarEstoqueAsync(int id, MovimentarEstoqueRequest request, CancellationToken ct = default)
    {
        var produto = await ObterOuFalharAsync(id, ct);

        try
        {
            produto.AdicionarEstoque(request.Quantidade);
        }
        catch (ArgumentException ex)
        {
            throw new ValidationAppException(ex.Message);
        }

        await unitOfWork.SalvarAsync(ct);

        logger.LogInformation("Entrada de estoque de {Quantidade} no produto {ProdutoId}", request.Quantidade, id);

        return MapearResponse(produto);
    }

    public async Task<ProdutoResponse> RemoverEstoqueAsync(int id, MovimentarEstoqueRequest request, CancellationToken ct = default)
    {
        var produto = await ObterOuFalharAsync(id, ct);

        try
        {
            produto.RemoverEstoque(request.Quantidade);
        }
        catch (ArgumentException ex)
        {
            throw new ValidationAppException(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            throw new ConflictException(ex.Message);
        }

        await unitOfWork.SalvarAsync(ct);

        logger.LogInformation("Saída de estoque de {Quantidade} no produto {ProdutoId}", request.Quantidade, id);

        return MapearResponse(produto);
    }

    private async Task<Produto> ObterOuFalharAsync(int id, CancellationToken ct)
    {
        var produto = await unitOfWork.Produtos.ObterPorIdAsync(id, ct);

        if (produto is null)
            throw new NotFoundException($"Produto {id} não encontrado.");

        return produto;
    }

    private static ProdutoResponse MapearResponse(Produto produto) => new()
    {
        Id = produto.Id,
        Nome = produto.Nome,
        Preco = produto.Preco,
        QuantidadeEstoque = produto.QuantidadeEstoque
    };
}
