using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FortunatoAgricola.Application.Interfaces;
using FortunatoAgricola.Application.DTOs;
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

        public async Task<IEnumerable<NotificacaoDto>> GetNotificacoesAsync()
        {
            var notificacoes = new List<NotificacaoDto>();

            // 1. Contratos próximos do limite (> 90%)
            var contratosQuaseFim = await _context.Contratos
                .Where(c => c.IsActive && c.QuantidadeTotalKg > 0)
                .Select(c => new { 
                    c.NumeroContrato, 
                    Percentual = (double)c.QuantidadeEntregueKg / (double)c.QuantidadeTotalKg 
                })
                .Where(c => c.Percentual >= 0.90 && c.Percentual < 1.0)
                .ToListAsync();

            foreach (var c in contratosQuaseFim)
            {
                notificacoes.Add(new NotificacaoDto
                {
                    Titulo = "Saldo Quase no Fim",
                    Mensagem = $"Contrato {c.NumeroContrato} (${Math.Round(c.Percentual * 100, 1)}%)",
                    Tipo = "warning",
                    Icone = "bi-exclamation-triangle",
                    Data = DateTime.Now
                });
            }

            // 2. Movimentações de hoje
            var hoje = DateTime.Today;
            var qtdeMovimentacoesHoje = await _context.Movimentacoes
                .Where(m => m.Data.Date == hoje)
                .CountAsync();

            if (qtdeMovimentacoesHoje > 0)
            {
                notificacoes.Add(new NotificacaoDto
                {
                    Titulo = "Nova Movimentação",
                    Mensagem = $"{qtdeMovimentacoesHoje} ticket(s) hoje.",
                    Tipo = "info",
                    Icone = "bi-truck",
                    Data = DateTime.Now
                });
            }

            return notificacoes.OrderByDescending(n => n.Data).ThenByDescending(n => n.Tipo);
        }
    }
}

