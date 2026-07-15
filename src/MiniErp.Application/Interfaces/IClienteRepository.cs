using MiniErp.Domain.Entities;

namespace MiniErp.Application.Interfaces;

public interface IClienteRepository
{
    Task<Cliente?> ObterPorIdAsync(int id, CancellationToken ct = default);

    Task<(List<Cliente> Itens, int TotalItens)> ListarAsync(
        string? busca,
        int pagina,
        int tamanhoPagina,
        CancellationToken ct = default);

    Task<int> ContarAsync(CancellationToken ct = default);

    void Adicionar(Cliente cliente);

    void Remover(Cliente cliente);
}
