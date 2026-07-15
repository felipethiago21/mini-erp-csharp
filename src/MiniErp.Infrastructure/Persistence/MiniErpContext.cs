using Microsoft.EntityFrameworkCore;
using MiniErp.Domain.Entities;

namespace MiniErp.Infrastructure.Persistence;

public class MiniErpContext(DbContextOptions<MiniErpContext> options) : DbContext(options)
{
    public DbSet<Produto> Produtos { get; set; } = null!;
    public DbSet<Cliente> Clientes { get; set; } = null!;
    public DbSet<Venda> Vendas { get; set; } = null!;
    public DbSet<ItemVenda> ItensVenda { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Produto>().Property(p => p.Preco).HasPrecision(18, 2);
        modelBuilder.Entity<ItemVenda>().Property(i => i.PrecoUnitario).HasPrecision(18, 2);

        modelBuilder.Entity<Venda>()
            .HasMany(v => v.Itens)
            .WithOne(i => i.Venda)
            .HasForeignKey(i => i.VendaId);

        base.OnModelCreating(modelBuilder);
    }
}
