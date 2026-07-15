using Microsoft.AspNetCore.Mvc;
using MiniErp.Application.DTOs.Clientes;
using MiniErp.Application.DTOs.Common;
using MiniErp.Application.Interfaces;

namespace MiniErp.Api.Controllers;

[ApiController]
[Route("api/clientes")]
public class ClientesController(IClienteService clienteService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<ClienteResponse>>> Listar(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? busca = null,
        CancellationToken ct = default)
    {
        var resultado = await clienteService.ListarAsync(
            new PaginacaoRequest { Pagina = page, TamanhoPagina = pageSize, Busca = busca }, ct);

        return Ok(resultado);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ClienteResponse>> ObterPorId(int id, CancellationToken ct)
    {
        var cliente = await clienteService.ObterPorIdAsync(id, ct);
        return Ok(cliente);
    }

    [HttpPost]
    public async Task<ActionResult<ClienteResponse>> Cadastrar(CriarClienteRequest request, CancellationToken ct)
    {
        var cliente = await clienteService.CadastrarAsync(request, ct);
        return CreatedAtAction(nameof(ObterPorId), new { id = cliente.Id }, cliente);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ClienteResponse>> Atualizar(int id, AtualizarClienteRequest request, CancellationToken ct)
    {
        var cliente = await clienteService.AtualizarAsync(id, request, ct);
        return Ok(cliente);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Excluir(int id, CancellationToken ct)
    {
        await clienteService.ExcluirAsync(id, ct);
        return NoContent();
    }
}
