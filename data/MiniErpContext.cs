using Microsoft.EntityFrameworkCore;
using MiniErp.Models;

namespace MiniErp.Data;

public class MiniErpContext : DbContext
{
    public DbSet<Produto> Produtos { get; set; }
    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<Venda> Vendas { get; set; }
    public DbSet<ItemVenda> ItensVenda { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=minierp.db");
    }
}