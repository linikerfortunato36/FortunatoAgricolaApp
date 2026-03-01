using System.Threading.Tasks;

namespace FortunatoAgricola.Application.Interfaces
{
    public interface IDashboardService
    {
        Task<object> GetDashboardStatsAsync();
    }
}
