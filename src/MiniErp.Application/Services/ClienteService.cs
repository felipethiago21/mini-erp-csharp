using Microsoft.Extensions.Logging;
using MiniErp.Application.DTOs.Clientes;
using MiniErp.Application.DTOs.Common;
using MiniErp.Application.Exceptions;
using MiniErp.Application.Interfaces;
using MiniErp.Domain.Entities;

namespace MiniErp.Application.Services;

public class ClienteService(IUnitOfWork unitOfWork, ILogger<ClienteService> logger) : IClienteService
{
    public async Task<ClienteResponse> CadastrarAsync(CriarClienteRequest request, CancellationToken ct = default)
    {
        var cliente = new Cliente
        {
            Nome = request.Nome,
            Email = request.Email
        };

        unitOfWork.Clientes.Adicionar(cliente);
        await unitOfWork.SalvarAsync(ct);

        logger.LogInformation("Cliente {ClienteId} cadastrado", cliente.Id);

        return MapearResponse(cliente);
    }

    public async Task<PaginatedResponse<ClienteResponse>> ListarAsync(PaginacaoRequest request, CancellationToken ct = default)
    {
        var (itens, total) = await unitOfWork.Clientes.ListarAsync(request.Busca, request.Pagina, request.TamanhoPagina, ct);

        return new PaginatedResponse<ClienteResponse>
        {
            Itens = itens.Select(MapearResponse).ToList(),
            Pagina = request.Pagina,
            TamanhoPagina = request.TamanhoPagina,
            TotalItens = total
        };
    }

    public async Task<ClienteResponse> ObterPorIdAsync(int id, CancellationToken ct = default)
    {
        var cliente = await ObterOuFalharAsync(id, ct);
        return MapearResponse(cliente);
    }

    public async Task<ClienteResponse> AtualizarAsync(int id, AtualizarClienteRequest request, CancellationToken ct = default)
    {
        var cliente = await ObterOuFalharAsync(id, ct);

        cliente.Nome = request.Nome;
        cliente.Email = request.Email;

        await unitOfWork.SalvarAsync(ct);

        return MapearResponse(cliente);
    }

    public async Task ExcluirAsync(int id, CancellationToken ct = default)
    {
        var cliente = await ObterOuFalharAsync(id, ct);

        unitOfWork.Clientes.Remover(cliente);
        await unitOfWork.SalvarAsync(ct);
    }

    private async Task<Cliente> ObterOuFalharAsync(int id, CancellationToken ct)
    {
        var cliente = await unitOfWork.Clientes.ObterPorIdAsync(id, ct);

        if (cliente is null)
            throw new NotFoundException($"Cliente {id} não encontrado.");

        return cliente;
    }

    private static ClienteResponse MapearResponse(Cliente cliente) => new()
    {
        Id = cliente.Id,
        Nome = cliente.Nome,
        Email = cliente.Email
    };
}
