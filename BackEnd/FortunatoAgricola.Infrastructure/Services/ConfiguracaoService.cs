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
                RazaoSocial = c.RazaoSocial,
                Cnpj = c.Cnpj,
                MargemLucro = c.MargemLucro,
                ToleranciaQuebraPeso = c.ToleranciaQuebraPeso,
                ToleranciaUmidade = c.ToleranciaUmidade,
                ValorImpostoPorSaca = c.ValorImpostoPorSaca,
                ValorComissaoPorSaca = c.ValorComissaoPorSaca,
                CreatedAt = c.CreatedAt,
                CreatedByName = c.CreatedByName,
                UpdatedAt = c.UpdatedAt,
                UpdatedByName = c.UpdatedByName
            };
        }

        public async Task<ConfiguracaoDto> UpdateAsync(UpdateConfiguracaoDto dto)
        {
            var c = await _context.Configuracoes.FindAsync(dto.Id);
            if (c == null)
            {
                c = new Configuracao
                {
                    RazaoSocial = dto.RazaoSocial,
                    Cnpj = dto.Cnpj,
                    MargemLucro = dto.MargemLucro,
                    ToleranciaQuebraPeso = dto.ToleranciaQuebraPeso,
                    ToleranciaUmidade = dto.ToleranciaUmidade,
                    ValorImpostoPorSaca = dto.ValorImpostoPorSaca,
                    ValorComissaoPorSaca = dto.ValorComissaoPorSaca
                };
                await _context.Configuracoes.AddAsync(c);
            }
            else
            {
                c.RazaoSocial = dto.RazaoSocial;
                c.Cnpj = dto.Cnpj;
                c.MargemLucro = dto.MargemLucro;
                c.ToleranciaQuebraPeso = dto.ToleranciaQuebraPeso;
                c.ToleranciaUmidade = dto.ToleranciaUmidade;
                c.ValorImpostoPorSaca = dto.ValorImpostoPorSaca;
                c.ValorComissaoPorSaca = dto.ValorComissaoPorSaca;
                c.UpdatedAt = DateTime.UtcNow;
                _context.Configuracoes.Update(c);
            }
            await _context.SaveChangesAsync();
            return (await GetAsync())!;
        }
    }
}
