using MiniErp.Application.DTOs.Dashboard;

namespace MiniErp.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardResumoResponse> ObterResumoAsync(CancellationToken ct = default);
}
