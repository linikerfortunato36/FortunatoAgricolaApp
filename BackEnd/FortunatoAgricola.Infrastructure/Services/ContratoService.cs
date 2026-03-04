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
                .Include(c => c.ProdutoresVinculados).ThenInclude(pv => pv.Produtor)
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
                ValorVendaPorSaca = c.ValorVendaPorSaca,
                IsActive = c.IsActive,
                CreatedAt = c.CreatedAt,
                CreatedByName = c.CreatedByName,
                UpdatedAt = c.UpdatedAt,
                UpdatedByName = c.UpdatedByName,
                ProdutoresVinculados = c.ProdutoresVinculados.Select(pv => new ContratoProdutorDto
                {
                    ContratoId = pv.ContratoId,
                    ProdutorId = pv.ProdutorId,
                    ProdutorNome = pv.Produtor?.Nome ?? string.Empty,
                    QuantidadeCotaKg = pv.QuantidadeCotaKg,
                    QuantidadeEntregueKg = pv.QuantidadeEntregueKg,
                    QuantidadeRestanteKg = pv.QuantidadeRestanteKg,
                    ValorCompraPorSaca = pv.ValorCompraPorSaca
                }).ToList()
            });
        }

        public async Task<ContratoDto> GetByIdAsync(Guid id)
        {
            var c = await _context.Contratos
                .Include(co => co.Cliente)
                .Include(co => co.Movimentacoes)
                .Include(co => co.ProdutoresVinculados).ThenInclude(pv => pv.Produtor)
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
                ValorVendaPorSaca = c.ValorVendaPorSaca,
                IsActive = c.IsActive,
                CreatedAt = c.CreatedAt,
                CreatedByName = c.CreatedByName,
                UpdatedAt = c.UpdatedAt,
                UpdatedByName = c.UpdatedByName,
                ProdutoresVinculados = c.ProdutoresVinculados.Select(pv => new ContratoProdutorDto
                {
                    ContratoId = pv.ContratoId,
                    ProdutorId = pv.ProdutorId,
                    ProdutorNome = pv.Produtor?.Nome ?? string.Empty,
                    QuantidadeCotaKg = pv.QuantidadeCotaKg,
                    QuantidadeEntregueKg = pv.QuantidadeEntregueKg,
                    QuantidadeRestanteKg = pv.QuantidadeRestanteKg,
                    ValorCompraPorSaca = pv.ValorCompraPorSaca
                }).ToList()
            };
        }

        public async Task<ContratoDto> CreateAsync(CreateContratoDto dto)
        {
            var contrato = new Contrato
            {
                ClienteId = dto.ClienteId,
                NumeroContrato = dto.NumeroContrato,
                QuantidadeTotalKg = dto.QuantidadeTotalKg,
                ValorVendaPorSaca = dto.ValorVendaPorSaca,
                QuantidadeEntregueKg = 0,
                Status = "Aberto",
                IsActive = true
            };

            await _context.Contratos.AddAsync(contrato);
            await _context.SaveChangesAsync();

            if (dto.ProdutoresVinculados != null && dto.ProdutoresVinculados.Any())
            {
                foreach (var pv in dto.ProdutoresVinculados)
                {
                    await _context.ContratoProdutores.AddAsync(new ContratoProdutor
                    {
                        ContratoId = contrato.Id,
                        ProdutorId = pv.ProdutorId,
                        QuantidadeCotaKg = pv.QuantidadeCotaKg,
                        ValorCompraPorSaca = pv.ValorCompraPorSaca,
                        QuantidadeEntregueKg = 0
                    });
                }
                await _context.SaveChangesAsync();
            }

            return await GetByIdAsync(contrato.Id);
        }

        public async Task<ContratoDto> UpdateAsync(UpdateContratoDto dto)
        {
            var c = await _context.Contratos
                .Include(co => co.ProdutoresVinculados)
                .FirstOrDefaultAsync(co => co.Id == dto.Id);
                
            if (c == null) throw new Exception("Contrato não encontrado.");

            c.NumeroContrato = dto.NumeroContrato;
            c.QuantidadeTotalKg = dto.QuantidadeTotalKg;
            c.ValorVendaPorSaca = dto.ValorVendaPorSaca;
            c.Status = dto.Status;
            c.IsActive = dto.IsActive;
            c.UpdatedAt = DateTime.UtcNow;

            _context.Contratos.Update(c);
            
            if (dto.ProdutoresVinculados != null)
            {
                var existingProdutores = c.ProdutoresVinculados.ToList();
                var incomingProdutorIds = dto.ProdutoresVinculados.Select(p => p.ProdutorId).ToList();

                // Remove unselected
                var toRemove = existingProdutores.Where(ep => !incomingProdutorIds.Contains(ep.ProdutorId)).ToList();
                _context.ContratoProdutores.RemoveRange(toRemove);

                foreach (var pv in dto.ProdutoresVinculados)
                {
                    var existing = existingProdutores.FirstOrDefault(ep => ep.ProdutorId == pv.ProdutorId);
                    if (existing != null)
                    {
                        existing.QuantidadeCotaKg = pv.QuantidadeCotaKg;
                        existing.ValorCompraPorSaca = pv.ValorCompraPorSaca;
                        _context.ContratoProdutores.Update(existing);
                    }
                    else
                    {
                        await _context.ContratoProdutores.AddAsync(new ContratoProdutor
                        {
                            ContratoId = c.Id,
                            ProdutorId = pv.ProdutorId,
                            QuantidadeCotaKg = pv.QuantidadeCotaKg,
                            ValorCompraPorSaca = pv.ValorCompraPorSaca,
                            QuantidadeEntregueKg = 0
                        });
                    }
                }
            }

            await _context.SaveChangesAsync();

            return await GetByIdAsync(c.Id);
        }

        public async Task<IEnumerable<ContratoDto>> GetByClienteIdAsync(Guid clienteId)
        {
            var contratos = await _context.Contratos
                .Include(c => c.Cliente)
                .Include(c => c.Movimentacoes)
                .Include(c => c.ProdutoresVinculados).ThenInclude(pv => pv.Produtor)
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
                ValorVendaPorSaca = c.ValorVendaPorSaca,
                IsActive = c.IsActive,
                CreatedAt = c.CreatedAt,
                CreatedByName = c.CreatedByName,
                UpdatedAt = c.UpdatedAt,
                UpdatedByName = c.UpdatedByName,
                ProdutoresVinculados = c.ProdutoresVinculados.Select(pv => new ContratoProdutorDto
                {
                    ContratoId = pv.ContratoId,
                    ProdutorId = pv.ProdutorId,
                    ProdutorNome = pv.Produtor?.Nome ?? string.Empty,
                    QuantidadeCotaKg = pv.QuantidadeCotaKg,
                    QuantidadeEntregueKg = pv.QuantidadeEntregueKg,
                    QuantidadeRestanteKg = pv.QuantidadeRestanteKg,
                    ValorCompraPorSaca = pv.ValorCompraPorSaca
                }).ToList()
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
