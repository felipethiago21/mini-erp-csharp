using MiniErp.Domain.Entities;

namespace MiniErp.Application.Interfaces;

public interface IVendaRepository
{
    Task<Venda?> ObterPorIdAsync(int id, CancellationToken ct = default);

    Task<List<Venda>> ListarAsync(CancellationToken ct = default);

    Task<List<Venda>> ObterMaisRecentesAsync(int quantidade, CancellationToken ct = default);

    Task<int> ContarAsync(CancellationToken ct = default);

    void Adicionar(Venda venda);
}
