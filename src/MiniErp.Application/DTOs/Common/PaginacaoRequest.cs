namespace MiniErp.Application.DTOs.Common;

public class PaginacaoRequest
{
    public int Pagina { get; set; } = 1;
    public int TamanhoPagina { get; set; } = 10;
    public string? Busca { get; set; }
}
