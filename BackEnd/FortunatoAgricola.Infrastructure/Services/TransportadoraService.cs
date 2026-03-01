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
    public class TransportadoraService : ITransportadoraService
    {
        private readonly ApplicationDbContext _context;

        public TransportadoraService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TransportadoraDto>> GetAllAsync()
        {
            return await _context.Transportadoras
                .OrderBy(t => t.Nome)
                .Select(t => new TransportadoraDto
                {
                    Id = t.Id,
                    Nome = t.Nome,
                    CpfCnpj = t.CpfCnpj,
                    InscricaoEstadual = t.InscricaoEstadual,
                    Cep = t.Cep,
                    Logradouro = t.Logradouro,
                    Estado = t.Estado,
                    IsActive = t.IsActive,
                    TotalViagens = _context.Movimentacoes.Count(m => m.TransportadoraId == t.Id && !m.IsDeleted),
                    CreatedAt = t.CreatedAt,
                    CreatedByName = t.CreatedByName,
                    UpdatedAt = t.UpdatedAt,
                    UpdatedByName = t.UpdatedByName
                })
                .ToListAsync();
        }

        public async Task<TransportadoraDto?> GetByIdAsync(Guid id)
        {
            var t = await _context.Transportadoras.FindAsync(id);
            if (t == null) return null;
            return new TransportadoraDto 
            { 
                Id = t.Id, 
                Nome = t.Nome, 
                CpfCnpj = t.CpfCnpj, 
                InscricaoEstadual = t.InscricaoEstadual,
                Cep = t.Cep,
                Logradouro = t.Logradouro,
                Estado = t.Estado,
                IsActive = t.IsActive,
                CreatedAt = t.CreatedAt,
                CreatedByName = t.CreatedByName,
                UpdatedAt = t.UpdatedAt,
                UpdatedByName = t.UpdatedByName 
            };
        }

        public async Task<TransportadoraDto> CreateAsync(CreateTransportadoraDto dto)
        {
            var t = new Transportadora 
            { 
                Nome = dto.Nome, 
                CpfCnpj = dto.CpfCnpj, 
                InscricaoEstadual = dto.InscricaoEstadual,
                Cep = dto.Cep,
                Logradouro = dto.Logradouro,
                Estado = dto.Estado,
                IsActive = true 
            };
            await _context.Transportadoras.AddAsync(t);
            await _context.SaveChangesAsync();
            return (await GetByIdAsync(t.Id))!;
        }

        public async Task<TransportadoraDto> UpdateAsync(UpdateTransportadoraDto dto)
        {
            var t = await _context.Transportadoras.FindAsync(dto.Id);
            if (t == null) throw new Exception("Transportadora não encontrada.");
            t.Nome = dto.Nome;
            t.CpfCnpj = dto.CpfCnpj;
            t.InscricaoEstadual = dto.InscricaoEstadual;
            t.Cep = dto.Cep;
            t.Logradouro = dto.Logradouro;
            t.Estado = dto.Estado;
            t.IsActive = dto.IsActive;
            t.UpdatedAt = DateTime.UtcNow;
            _context.Transportadoras.Update(t);
            await _context.SaveChangesAsync();
            return (await GetByIdAsync(t.Id))!;
        }

        public async Task DeleteAsync(Guid id)
        {
            var hasMovimentacoes = await _context.Movimentacoes.AnyAsync(m => m.TransportadoraId == id && !m.IsDeleted);
            if (hasMovimentacoes)
            {
                throw new InvalidOperationException("Esta transportadora possui movimentações vinculadas. Inative-a em vez de excluí-la.");
            }

            var t = await _context.Transportadoras.FindAsync(id);
            if (t != null)
            {
                t.IsDeleted = true;
                t.UpdatedAt = DateTime.UtcNow;
                _context.Transportadoras.Update(t);
                await _context.SaveChangesAsync();
            }
        }
    }
}
