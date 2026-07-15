using MiniErp.Application.DTOs.Common;
using MiniErp.Application.DTOs.Produtos;

namespace MiniErp.Application.Interfaces;

public interface IProdutoService
{
    Task<ProdutoResponse> CadastrarAsync(CriarProdutoRequest request, CancellationToken ct = default);
    Task<PaginatedResponse<ProdutoResponse>> ListarAsync(PaginacaoRequest request, CancellationToken ct = default);
    Task<ProdutoResponse> ObterPorIdAsync(int id, CancellationToken ct = default);
    Task<ProdutoResponse> AtualizarAsync(int id, AtualizarProdutoRequest request, CancellationToken ct = default);
    Task ExcluirAsync(int id, CancellationToken ct = default);
    Task<ProdutoResponse> AdicionarEstoqueAsync(int id, MovimentarEstoqueRequest request, CancellationToken ct = default);
    Task<ProdutoResponse> RemoverEstoqueAsync(int id, MovimentarEstoqueRequest request, CancellationToken ct = default);
}
