using MiniErp.Application.DTOs.Clientes;
using MiniErp.Application.DTOs.Common;

namespace MiniErp.Application.Interfaces;

public interface IClienteService
{
    Task<ClienteResponse> CadastrarAsync(CriarClienteRequest request, CancellationToken ct = default);
    Task<PaginatedResponse<ClienteResponse>> ListarAsync(PaginacaoRequest request, CancellationToken ct = default);
    Task<ClienteResponse> ObterPorIdAsync(int id, CancellationToken ct = default);
    Task<ClienteResponse> AtualizarAsync(int id, AtualizarClienteRequest request, CancellationToken ct = default);
    Task ExcluirAsync(int id, CancellationToken ct = default);
}
