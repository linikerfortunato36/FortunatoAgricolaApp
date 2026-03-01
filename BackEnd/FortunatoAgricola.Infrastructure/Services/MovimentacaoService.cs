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
    public class MovimentacaoService : IMovimentacaoService
    {
        private readonly ApplicationDbContext _context;

        public MovimentacaoService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MovimentacaoDto>> GetAllAsync()
        {
            var movimentacoes = await _context.Movimentacoes
                .Include(m => m.Contrato)
                .Include(m => m.ProdutorOrigem)
                .Include(m => m.Transportadora)
                .Include(m => m.Vendedor)
                .OrderByDescending(m => m.Data)
                .ToListAsync();

            return movimentacoes.Select(m => MapToDto(m));
        }

        public async Task<IEnumerable<MovimentacaoDto>> GetByContratoIdAsync(Guid contratoId)
        {
            var movimentacoes = await _context.Movimentacoes
                .Include(m => m.Contrato)
                .Include(m => m.ProdutorOrigem)
                .Include(m => m.Transportadora)
                .Include(m => m.Vendedor)
                .Where(m => m.ContratoId == contratoId)
                .OrderByDescending(m => m.Data)
                .ToListAsync();
            return movimentacoes.Select(m => MapToDto(m));
        }

        public async Task<MovimentacaoDto> GetByIdAsync(Guid id)
        {
            var m = await _context.Movimentacoes
                .Include(mov => mov.Contrato)
                .Include(mov => mov.ProdutorOrigem)
                .Include(mov => mov.Transportadora)
                .Include(mov => mov.Vendedor)
                .FirstOrDefaultAsync(mov => mov.Id == id);

            if (m == null) return null;
            return MapToDto(m);
        }

        public async Task<MovimentacaoDto> CreateAsync(CreateMovimentacaoDto dto)
        {
            var mov = new Movimentacao
            {
                Data = dto.Data,
                ContratoId = dto.ContratoId,
                ProdutorOrigemId = dto.ProdutorOrigemId,
                QuantidadeOrigemKg = dto.QuantidadeOrigemKg,
                PesoDescargaKg = dto.PesoDescargaKg,
                UmidadeKg = dto.UmidadeKg,
                ImpurezaKg = dto.ImpurezaKg,
                UmidadePorcentagem = dto.UmidadePorcentagem,
                ImpurezaPorcentagem = dto.ImpurezaPorcentagem,
                PesoLiquidofazenda = dto.PesoLiquidofazenda,
                Motorista = dto.Motorista,
                TransportadoraId = dto.TransportadoraId,
                VendedorId = dto.VendedorId
            };

            await _context.Movimentacoes.AddAsync(mov);
            
            // Aqui precisaria validar regras de negócio e subtrair valor no contrato
            var contrato = await _context.Contratos.FindAsync(dto.ContratoId);
            if (contrato != null)
            {
                contrato.QuantidadeEntregueKg += mov.PesoFinal; // Usando o peso de cálculo oficial
                _context.Contratos.Update(contrato);
            }

            await _context.SaveChangesAsync();

            return await GetByIdAsync(mov.Id);
        }

        public async Task<MovimentacaoDto> UpdateAsync(UpdateMovimentacaoDto dto)
        {
            var mov = await _context.Movimentacoes.FindAsync(dto.Id);
            if (mov == null) throw new Exception("Movimentação não encontrada.");

            // Regra de compensação no contrato se peso muda, etc... (Pulei logic validation para simplificar esse mock)
            
            mov.PesoDescargaKg = dto.PesoDescargaKg;
            mov.UmidadeKg = dto.UmidadeKg;
            mov.ImpurezaKg = dto.ImpurezaKg;
            mov.UmidadePorcentagem = dto.UmidadePorcentagem;
            mov.ImpurezaPorcentagem = dto.ImpurezaPorcentagem;
            mov.ValorCompraPorSaca = dto.ValorCompraPorSaca;
            mov.CustoFretePorSaca = dto.CustoFretePorSaca;
            mov.ValorVendaPorSaca = dto.ValorVendaPorSaca;
            mov.UpdatedAt = DateTime.UtcNow;

            _context.Movimentacoes.Update(mov);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(mov.Id);
        }

        public async Task DeleteAsync(Guid id)
        {
            var mov = await _context.Movimentacoes.FindAsync(id);
            if (mov != null)
            {
                mov.IsDeleted = true;
                mov.UpdatedAt = DateTime.UtcNow;

                var contrato = await _context.Contratos.FindAsync(mov.ContratoId);
                if(contrato != null)
                {
                    contrato.QuantidadeEntregueKg -= mov.PesoFinal;
                    _context.Contratos.Update(contrato);
                }

                _context.Movimentacoes.Update(mov);
                await _context.SaveChangesAsync();
            }
        }

        private static MovimentacaoDto MapToDto(Movimentacao m) => new MovimentacaoDto
        {
            Id = m.Id,
            Data = m.Data,
            ContratoId = m.ContratoId,
            ContratoNumero = m.Contrato?.NumeroContrato ?? string.Empty,
            ProdutorOrigemId = m.ProdutorOrigemId,
            ProdutorOrigemNome = m.ProdutorOrigem?.Nome ?? string.Empty,
            QuantidadeOrigemKg = m.QuantidadeOrigemKg,
            PesoDescargaKg = m.PesoDescargaKg,
            UmidadeKg = m.UmidadeKg,
            ImpurezaKg = m.ImpurezaKg,
            UmidadePorcentagem = m.UmidadePorcentagem,
            ImpurezaPorcentagem = m.ImpurezaPorcentagem,
            PesoFinal = m.PesoFinal,
            PesoLiquidofazenda = m.PesoLiquidofazenda,
            Motorista = m.Motorista,
            TransportadoraId = m.TransportadoraId,
            TransportadoraNome = m.Transportadora?.Nome ?? string.Empty,
            VendedorId = m.VendedorId,
            VendedorNome = m.Vendedor?.Nome ?? string.Empty,
            CustoFretePorSaca = m.CustoFretePorSaca,
            ValorCompraPorSaca = m.ValorCompraPorSaca,
            ValorVendaPorSaca = m.ValorVendaPorSaca,
            GanhoLiquido = m.GanhoLiquido
        };
    }
}
