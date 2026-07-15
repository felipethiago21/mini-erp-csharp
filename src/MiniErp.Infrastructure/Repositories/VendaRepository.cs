using Microsoft.EntityFrameworkCore;
using MiniErp.Application.Interfaces;
using MiniErp.Domain.Entities;
using MiniErp.Infrastructure.Persistence;

namespace MiniErp.Infrastructure.Repositories;

public class VendaRepository(MiniErpContext context) : IVendaRepository
{
    public Task<Venda?> ObterPorIdAsync(int id, CancellationToken ct = default) =>
        context.Vendas
            .Include(v => v.Cliente)
            .Include(v => v.Itens)
                .ThenInclude(i => i.Produto)
            .FirstOrDefaultAsync(v => v.Id == id, ct);

    public Task<List<Venda>> ListarAsync(CancellationToken ct = default) =>
        context.Vendas
            .Include(v => v.Cliente)
            .Include(v => v.Itens)
                .ThenInclude(i => i.Produto)
            .OrderByDescending(v => v.Data)
            .ToListAsync(ct);

    public Task<List<Venda>> ObterMaisRecentesAsync(int quantidade, CancellationToken ct = default) =>
        context.Vendas
            .Include(v => v.Cliente)
            .Include(v => v.Itens)
                .ThenInclude(i => i.Produto)
            .OrderByDescending(v => v.Data)
            .Take(quantidade)
            .ToListAsync(ct);

    public Task<int> ContarAsync(CancellationToken ct = default) =>
        context.Vendas.CountAsync(ct);

    public void Adicionar(Venda venda) => context.Vendas.Add(venda);
}
