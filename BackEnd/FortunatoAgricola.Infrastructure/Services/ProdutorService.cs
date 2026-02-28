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
    public class ProdutorService : IProdutorService
    {
        private readonly ApplicationDbContext _context;

        public ProdutorService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProdutorDto>> GetAllAsync()
        {
            var produtores = await _context.Produtores
                .OrderBy(p => p.Nome)
                .ToListAsync();

            return produtores.Select(p => new ProdutorDto
            {
                Id = p.Id,
                Nome = p.Nome,
                CpfCnpj = p.CpfCnpj,
                InscricaoEstadual = p.InscricaoEstadual,
                IsActive = p.IsActive
            });
        }

        public async Task<ProdutorDto> GetByIdAsync(Guid id)
        {
            var p = await _context.Produtores.FindAsync(id);
            if (p == null) return null;

            return new ProdutorDto
            {
                Id = p.Id,
                Nome = p.Nome,
                CpfCnpj = p.CpfCnpj,
                InscricaoEstadual = p.InscricaoEstadual,
                IsActive = p.IsActive
            };
        }

        public async Task<ProdutorDto> CreateAsync(CreateProdutorDto dto)
        {
            var produtor = new Produtor
            {
                Nome = dto.Nome,
                CpfCnpj = dto.CpfCnpj,
                InscricaoEstadual = dto.InscricaoEstadual,
                IsActive = true
            };

            await _context.Produtores.AddAsync(produtor);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(produtor.Id);
        }

        public async Task<ProdutorDto> UpdateAsync(UpdateProdutorDto dto)
        {
            var p = await _context.Produtores.FindAsync(dto.Id);
            if (p == null) throw new Exception("Produtor não encontrado.");

            p.Nome = dto.Nome;
            p.CpfCnpj = dto.CpfCnpj;
            p.InscricaoEstadual = dto.InscricaoEstadual;
            p.IsActive = dto.IsActive;
            p.UpdatedAt = DateTime.UtcNow;

            _context.Produtores.Update(p);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(p.Id);
        }

        public async Task DeleteAsync(Guid id)
        {
            var p = await _context.Produtores.FindAsync(id);
            if (p != null)
            {
                p.IsDeleted = true;
                p.UpdatedAt = DateTime.UtcNow;
                _context.Produtores.Update(p);
                await _context.SaveChangesAsync();
            }
        }
    }
}
