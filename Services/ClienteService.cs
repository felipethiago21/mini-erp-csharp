using MiniErp.Models;

namespace MiniErp.Services;

public class ClienteService
{
    private readonly List<Cliente> _clientes = [];
    private int _proximoId = 1;

    public Cliente Cadastrar(string nome, string email)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("O nome é obrigatório.");

        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("O e-mail é obrigatório.");

        var cliente = new Cliente
        {
            Id = _proximoId++,
            Nome = nome,
            Email = email
        };

        _clientes.Add(cliente);

        return cliente;
    }

    public List<Cliente> Listar()
    {
        return _clientes;
    }

    public Cliente? BuscarPorId(int id)
    {
        return _clientes.FirstOrDefault(cliente => cliente.Id == id);
    }
}