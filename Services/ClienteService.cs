using MiniErp.Data;
using MiniErp.Models;

namespace MiniErp.Services;

public class ClienteService
{
    private readonly MiniErpContext _context;

    public ClienteService(MiniErpContext context)
    {
        _context = context;
    }

    public Cliente Cadastrar(string nome, string email)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("O nome é obrigatório.");

        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("O e-mail é obrigatório.");

        var cliente = new Cliente
        {
            Nome = nome,
            Email = email
        };

        _context.Clientes.Add(cliente);
        _context.SaveChanges();

        return cliente;
    }

    public List<Cliente> Listar()
    {
        return _context.Clientes.ToList();
    }

    public Cliente? BuscarPorId(int id)
    {
        return _context.Clientes.FirstOrDefault(cliente => cliente.Id == id);
    }
}