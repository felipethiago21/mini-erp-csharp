using Microsoft.Extensions.Logging;
using MiniErp.Application.DTOs.Vendas;
using MiniErp.Application.Exceptions;
using MiniErp.Application.Interfaces;
using MiniErp.Domain.Entities;

namespace MiniErp.Application.Services;

public class VendaService(IUnitOfWork unitOfWork, ILogger<VendaService> logger) : IVendaService
{
    public async Task<VendaResponse> RegistrarAsync(CriarVendaRequest request, CancellationToken ct = default)
    {
        if (request.Itens.Count == 0)
            throw new ValidationAppException("A venda deve conter ao menos um item.");

        Venda venda = null!;

        await unitOfWork.ExecutarEmTransacaoAsync(async () =>
        {
            var cliente = await unitOfWork.Clientes.ObterPorIdAsync(request.ClienteId, ct);

            if (cliente is null)
                throw new NotFoundException($"Cliente {request.ClienteId} não encontrado.");

            venda = new Venda
            {
                ClienteId = cliente.Id,
                Cliente = cliente,
                Data = DateTime.UtcNow
            };

            foreach (var itemRequest in request.Itens)
            {
                if (itemRequest.Quantidade <= 0)
                    throw new ValidationAppException("A quantidade de cada item deve ser maior que zero.");

                var produto = await unitOfWork.Produtos.ObterPorIdAsync(itemRequest.ProdutoId, ct);

                if (produto is null)
                    throw new NotFoundException($"Produto {itemRequest.ProdutoId} não encontrado.");

                if (!produto.TemEstoque(itemRequest.Quantidade))
                    throw new ConflictException($"Estoque insuficiente para o produto '{produto.Nome}'.");

                produto.RemoverEstoque(itemRequest.Quantidade);

                venda.Itens.Add(new ItemVenda
                {
                    ProdutoId = produto.Id,
                    Produto = produto,
                    Quantidade = itemRequest.Quantidade,
                    PrecoUnitario = produto.Preco
                });
            }

            unitOfWork.Vendas.Adicionar(venda);
            await unitOfWork.SalvarAsync(ct);
        }, ct);

        logger.LogInformation("Venda {VendaId} registrada para o cliente {ClienteId}", venda.Id, venda.ClienteId);

        return MapearResponse(venda);
    }

    public async Task<List<VendaResponse>> ListarAsync(CancellationToken ct = default)
    {
        var vendas = await unitOfWork.Vendas.ListarAsync(ct);
        return vendas.Select(MapearResponse).ToList();
    }

    public async Task<VendaResponse> ObterPorIdAsync(int id, CancellationToken ct = default)
    {
        var venda = await unitOfWork.Vendas.ObterPorIdAsync(id, ct);

        if (venda is null)
            throw new NotFoundException($"Venda {id} não encontrada.");

        return MapearResponse(venda);
    }

    private static VendaResponse MapearResponse(Venda venda) => new()
    {
        Id = venda.Id,
        ClienteId = venda.ClienteId,
        ClienteNome = venda.Cliente.Nome,
        Data = venda.Data,
        Total = venda.Total,
        Itens = venda.Itens.Select(item => new ItemVendaResponse
        {
            ProdutoId = item.ProdutoId,
            ProdutoNome = item.Produto.Nome,
            Quantidade = item.Quantidade,
            PrecoUnitario = item.PrecoUnitario,
            Subtotal = item.Subtotal
        }).ToList()
    };
}
