using Microsoft.EntityFrameworkCore;
using MiniErp.Models;

namespace MiniErp.Data;

public class MiniErpContext : DbContext
{
    public DbSet<Produto> Produtos { get; set; } = null!;
    public DbSet<Cliente> Clientes { get; set; } = null!;
    public DbSet<Venda> Vendas { get; set; } = null!;
    public DbSet<ItemVenda> ItensVenda { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=minierp.db");
    }
}