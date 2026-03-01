using FortunatoAgricola.Application.Interfaces;
using FortunatoAgricola.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FortunatoAgricola.Infrastructure.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly ApplicationDbContext _context;
        public DashboardService(ApplicationDbContext context) => _context = context;

        public async Task<object> GetDashboardStatsAsync()
        {
            var totalClientes = await _context.Clientes.CountAsync();
            var totalProdutores = await _context.Produtores.CountAsync();
            var totalMovimentacoes = await _context.Movimentacoes.CountAsync();
            var totalContratos = await _context.Contratos.CountAsync();
            
            // Exemplo de volume total (soma de peso líquido)
            var volumeTotal = await _context.Movimentacoes.SumAsync(m => m.PesoLiquidofazenda);

            // Dados para gráfico (últimos 7 dias)
            var ultimosMovimentos = await _context.Movimentacoes
                .OrderByDescending(m => m.Data)
                .Take(10)
                .Select(m => new { m.Data, m.PesoLiquidofazenda })
                .ToListAsync();

            // Top Contratos (com maior volume entregue em Kg)
            var topContratos = await _context.Contratos
                .Include(c => c.Cliente)
                .Where(c => c.IsActive && c.QuantidadeTotalKg > 0)
                .OrderByDescending(c => c.QuantidadeEntregueKg)
                .Take(3)
                .Select(c => new
                {
                    c.NumeroContrato,
                    ClienteNome = c.Cliente.Nome,
                    c.QuantidadeTotalKg,
                    c.QuantidadeEntregueKg,
                    PercentualProgresso = c.QuantidadeTotalKg > 0 ? (double)c.QuantidadeEntregueKg / (double)c.QuantidadeTotalKg * 100.0 : 0
                })
                .ToListAsync();

            return new
            {
                TotalClientes = totalClientes,
                TotalProdutores = totalProdutores,
                TotalMovimentacoes = totalMovimentacoes,
                TotalContratos = totalContratos,
                VolumeTotal = volumeTotal,
                UltimosMovimentos = ultimosMovimentos,
                TopContratos = topContratos
            };
        }
    }
}
