using Microsoft.EntityFrameworkCore;
using MiniErp.Application.Interfaces;
using MiniErp.Domain.Entities;
using MiniErp.Infrastructure.Persistence;

namespace MiniErp.Infrastructure.Repositories;

public class ClienteRepository(MiniErpContext context) : IClienteRepository
{
    public Task<Cliente?> ObterPorIdAsync(int id, CancellationToken ct = default) =>
        context.Clientes.FirstOrDefaultAsync(c => c.Id == id, ct);

    public async Task<(List<Cliente> Itens, int TotalItens)> ListarAsync(
        string? busca, int pagina, int tamanhoPagina, CancellationToken ct = default)
    {
        var query = context.Clientes.AsQueryable();

        if (!string.IsNullOrWhiteSpace(busca))
            query = query.Where(c => EF.Functions.Like(c.Nome, $"%{busca}%"));

        var total = await query.CountAsync(ct);

        var itens = await query
            .OrderBy(c => c.Id)
            .Skip((pagina - 1) * tamanhoPagina)
            .Take(tamanhoPagina)
            .ToListAsync(ct);

        return (itens, total);
    }

    public Task<int> ContarAsync(CancellationToken ct = default) =>
        context.Clientes.CountAsync(ct);

    public void Adicionar(Cliente cliente) => context.Clientes.Add(cliente);

    public void Remover(Cliente cliente) => context.Clientes.Remove(cliente);
}
