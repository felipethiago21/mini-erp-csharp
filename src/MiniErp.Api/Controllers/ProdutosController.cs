using Microsoft.AspNetCore.Mvc;
using MiniErp.Application.DTOs.Common;
using MiniErp.Application.DTOs.Produtos;
using MiniErp.Application.Interfaces;

namespace MiniErp.Api.Controllers;

[ApiController]
[Route("api/produtos")]
public class ProdutosController(IProdutoService produtoService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<ProdutoResponse>>> Listar(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? busca = null,
        CancellationToken ct = default)
    {
        var resultado = await produtoService.ListarAsync(
            new PaginacaoRequest { Pagina = page, TamanhoPagina = pageSize, Busca = busca }, ct);

        return Ok(resultado);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProdutoResponse>> ObterPorId(int id, CancellationToken ct)
    {
        var produto = await produtoService.ObterPorIdAsync(id, ct);
        return Ok(produto);
    }

    [HttpPost]
    public async Task<ActionResult<ProdutoResponse>> Cadastrar(CriarProdutoRequest request, CancellationToken ct)
    {
        var produto = await produtoService.CadastrarAsync(request, ct);
        return CreatedAtAction(nameof(ObterPorId), new { id = produto.Id }, produto);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProdutoResponse>> Atualizar(int id, AtualizarProdutoRequest request, CancellationToken ct)
    {
        var produto = await produtoService.AtualizarAsync(id, request, ct);
        return Ok(produto);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Excluir(int id, CancellationToken ct)
    {
        await produtoService.ExcluirAsync(id, ct);
        return NoContent();
    }

    [HttpPost("{id:int}/entrada-estoque")]
    public async Task<ActionResult<ProdutoResponse>> EntradaEstoque(int id, MovimentarEstoqueRequest request, CancellationToken ct)
    {
        var produto = await produtoService.AdicionarEstoqueAsync(id, request, ct);
        return Ok(produto);
    }

    [HttpPost("{id:int}/saida-estoque")]
    public async Task<ActionResult<ProdutoResponse>> SaidaEstoque(int id, MovimentarEstoqueRequest request, CancellationToken ct)
    {
        var produto = await produtoService.RemoverEstoqueAsync(id, request, ct);
        return Ok(produto);
    }
}
