using Microsoft.AspNetCore.Mvc;
using MiniErp.Application.DTOs.Dashboard;
using MiniErp.Application.Interfaces;

namespace MiniErp.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController(IDashboardService dashboardService) : ControllerBase
{
    [HttpGet("resumo")]
    public async Task<ActionResult<DashboardResumoResponse>> Resumo(CancellationToken ct)
    {
        var resumo = await dashboardService.ObterResumoAsync(ct);
        return Ok(resumo);
    }
}
