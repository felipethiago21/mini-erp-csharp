namespace MiniErp.Application.DTOs.Common;

public class PaginatedResponse<T>
{
    public List<T> Itens { get; set; } = [];
    public int Pagina { get; set; }
    public int TamanhoPagina { get; set; }
    public int TotalItens { get; set; }
    public int TotalPaginas => TamanhoPagina == 0 ? 0 : (int)Math.Ceiling(TotalItens / (double)TamanhoPagina);
}
