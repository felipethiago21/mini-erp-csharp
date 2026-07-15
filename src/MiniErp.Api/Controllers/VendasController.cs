using Microsoft.AspNetCore.Mvc;
using MiniErp.Application.DTOs.Vendas;
using MiniErp.Application.Interfaces;

namespace MiniErp.Api.Controllers;

[ApiController]
[Route("api/vendas")]
public class VendasController(IVendaService vendaService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<VendaResponse>>> Listar(CancellationToken ct)
    {
        var vendas = await vendaService.ListarAsync(ct);
        return Ok(vendas);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<VendaResponse>> ObterPorId(int id, CancellationToken ct)
    {
        var venda = await vendaService.ObterPorIdAsync(id, ct);
        return Ok(venda);
    }

    [HttpPost]
    public async Task<ActionResult<VendaResponse>> Registrar(CriarVendaRequest request, CancellationToken ct)
    {
        var venda = await vendaService.RegistrarAsync(request, ct);
        return CreatedAtAction(nameof(ObterPorId), new { id = venda.Id }, venda);
    }
}
