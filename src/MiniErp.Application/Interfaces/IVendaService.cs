using MiniErp.Application.DTOs.Vendas;

namespace MiniErp.Application.Interfaces;

public interface IVendaService
{
    Task<VendaResponse> RegistrarAsync(CriarVendaRequest request, CancellationToken ct = default);
    Task<List<VendaResponse>> ListarAsync(CancellationToken ct = default);
    Task<VendaResponse> ObterPorIdAsync(int id, CancellationToken ct = default);
}
