using Microsoft.AspNetCore.Mvc;
using FortunatoAgricola.Application.Interfaces;
using System.Threading.Tasks;

namespace FortunatoAgricola.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;
        public DashboardController(IDashboardService dashboardService) => _dashboardService = dashboardService;

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var stats = await _dashboardService.GetDashboardStatsAsync();
            return Ok(stats);
        }

        [HttpGet("notificacoes")]
        public async Task<IActionResult> GetNotificacoes()
        {
            var notificacoes = await _dashboardService.GetNotificacoesAsync();
            return Ok(notificacoes);
        }
    }
}

