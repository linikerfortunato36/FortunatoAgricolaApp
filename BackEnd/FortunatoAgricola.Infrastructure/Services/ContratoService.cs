using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FortunatoAgricola.Application.DTOs;
using FortunatoAgricola.Application.Interfaces;
using FortunatoAgricola.Domain.Entities;
using FortunatoAgricola.Infrastructure.Data;

namespace FortunatoAgricola.Infrastructure.Services
{
    public class ContratoService : IContratoService
    {
        private readonly ApplicationDbContext _context;

        public ContratoService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ContratoDto>> GetAllAsync()
        {
            var contratos = await _context.Contratos
                .Include(c => c.Cliente)
                .Include(c => c.Movimentacoes)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return contratos.Select(c => new ContratoDto
            {
                Id = c.Id,
                ClienteId = c.ClienteId,
                ClienteNome = c.Cliente?.Nome,
                NumeroContrato = c.NumeroContrato,
                Status = c.Status,
                QuantidadeTotalKg = c.QuantidadeTotalKg,
                QuantidadeEntregueKg = c.QuantidadeEntregueKg,
                QuantidadeRestanteKg = c.QuantidadeRestanteKg,
                QuantidadeEntregas = c.Movimentacoes?.Count ?? 0,
                ValorTotalNfe = c.Movimentacoes?.Sum(m => m.ValorNfe) ?? 0,
                IsActive = c.IsActive
            });
        }

        public async Task<ContratoDto> GetByIdAsync(Guid id)
        {
            var c = await _context.Contratos
                .Include(co => co.Cliente)
                .Include(co => co.Movimentacoes)
                .FirstOrDefaultAsync(co => co.Id == id);

            if (c == null) return null;

            return new ContratoDto
            {
                Id = c.Id,
                ClienteId = c.ClienteId,
                ClienteNome = c.Cliente?.Nome,
                NumeroContrato = c.NumeroContrato,
                Status = c.Status,
                QuantidadeTotalKg = c.QuantidadeTotalKg,
                QuantidadeEntregueKg = c.QuantidadeEntregueKg,
                QuantidadeRestanteKg = c.QuantidadeRestanteKg,
                QuantidadeEntregas = c.Movimentacoes?.Count ?? 0,
                ValorTotalNfe = c.Movimentacoes?.Sum(m => m.ValorNfe) ?? 0,
                IsActive = c.IsActive
            };
        }

        public async Task<ContratoDto> CreateAsync(CreateContratoDto dto)
        {
            var contrato = new Contrato
            {
                ClienteId = dto.ClienteId,
                NumeroContrato = dto.NumeroContrato,
                QuantidadeTotalKg = dto.QuantidadeTotalKg,
                QuantidadeEntregueKg = 0,
                Status = "Aberto",
                IsActive = true
            };

            await _context.Contratos.AddAsync(contrato);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(contrato.Id);
        }

        public async Task<ContratoDto> UpdateAsync(UpdateContratoDto dto)
        {
            var c = await _context.Contratos.FindAsync(dto.Id);
            if (c == null) throw new Exception("Contrato não encontrado.");

            c.NumeroContrato = dto.NumeroContrato;
            c.QuantidadeTotalKg = dto.QuantidadeTotalKg;
            c.Status = dto.Status;
            c.IsActive = dto.IsActive;
            c.UpdatedAt = DateTime.UtcNow;

            _context.Contratos.Update(c);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(c.Id);
        }

        public async Task<IEnumerable<ContratoDto>> GetByClienteIdAsync(Guid clienteId)
        {
            var contratos = await _context.Contratos
                .Include(c => c.Cliente)
                .Include(c => c.Movimentacoes)
                .Where(c => c.ClienteId == clienteId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return contratos.Select(c => new ContratoDto
            {
                Id = c.Id,
                ClienteId = c.ClienteId,
                ClienteNome = c.Cliente?.Nome,
                NumeroContrato = c.NumeroContrato,
                Status = c.Status,
                QuantidadeTotalKg = c.QuantidadeTotalKg,
                QuantidadeEntregueKg = c.QuantidadeEntregueKg,
                QuantidadeRestanteKg = c.QuantidadeRestanteKg,
                QuantidadeEntregas = c.Movimentacoes?.Count ?? 0,
                ValorTotalNfe = c.Movimentacoes?.Sum(m => m.ValorNfe) ?? 0,
                IsActive = c.IsActive
            });
        }

        public async Task DeleteAsync(Guid id)
        {
            var c = await _context.Contratos.FindAsync(id);
            if (c != null)
            {
                c.IsDeleted = true;
                c.UpdatedAt = DateTime.UtcNow;
                _context.Contratos.Update(c);
                await _context.SaveChangesAsync();
            }
        }
    }
}
