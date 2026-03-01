using System.Collections.Generic;
using System.Threading.Tasks;
using FortunatoAgricola.Application.DTOs;

namespace FortunatoAgricola.Application.Interfaces
{
    public interface IDashboardService
    {
        Task<object> GetDashboardStatsAsync();
        Task<IEnumerable<NotificacaoDto>> GetNotificacoesAsync();
    }
}
