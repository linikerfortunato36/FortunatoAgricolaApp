using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FortunatoAgricola.Application.DTOs;
using FortunatoAgricola.Application.Interfaces;
using FortunatoAgricola.Domain.Entities;
using FortunatoAgricola.Infrastructure.Data;

namespace FortunatoAgricola.Infrastructure.Services
{
    public class ConfiguracaoService : IConfiguracaoService
    {
        private readonly ApplicationDbContext _context;
        public ConfiguracaoService(ApplicationDbContext context) => _context = context;

        public async Task<ConfiguracaoDto?> GetAsync()
        {
            var c = await _context.Configuracoes.FirstOrDefaultAsync();
            if (c == null) return null;
            return new ConfiguracaoDto
            {
                Id = c.Id,
                ValorBaseComissaoVendaPorSaca = c.ValorBaseComissaoVendaPorSaca,
                PorcentagemImposto = c.PorcentagemImposto
            };
        }

        public async Task<ConfiguracaoDto> UpdateAsync(UpdateConfiguracaoDto dto)
        {
            var c = await _context.Configuracoes.FindAsync(dto.Id);
            if (c == null)
            {
                // Cria se não existir
                c = new Configuracao
                {
                    ValorBaseComissaoVendaPorSaca = dto.ValorBaseComissaoVendaPorSaca,
                    PorcentagemImposto = dto.PorcentagemImposto
                };
                await _context.Configuracoes.AddAsync(c);
            }
            else
            {
                c.ValorBaseComissaoVendaPorSaca = dto.ValorBaseComissaoVendaPorSaca;
                c.PorcentagemImposto = dto.PorcentagemImposto;
                c.UpdatedAt = DateTime.UtcNow;
                _context.Configuracoes.Update(c);
            }
            await _context.SaveChangesAsync();
            return new ConfiguracaoDto
            {
                Id = c.Id,
                ValorBaseComissaoVendaPorSaca = c.ValorBaseComissaoVendaPorSaca,
                PorcentagemImposto = c.PorcentagemImposto
            };
        }
    }
}
