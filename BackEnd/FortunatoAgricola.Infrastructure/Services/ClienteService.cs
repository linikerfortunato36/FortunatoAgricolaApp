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
    public class ClienteService : IClienteService
    {
        private readonly ApplicationDbContext _context;
        public ClienteService(ApplicationDbContext context) => _context = context;

        public async Task<IEnumerable<ClienteDto>> GetAllAsync()
        {
            return await _context.Clientes
                .OrderBy(c => c.Nome)
                .Select(c => new ClienteDto 
                { 
                    Id = c.Id, 
                    Nome = c.Nome, 
                    Cnpj = c.Cnpj, 
                    IsActive = c.IsActive,
                    InscricaoEstadual = c.InscricaoEstadual,
                    Email = c.Email,
                    CreatedAt = c.CreatedAt,
                    CreatedByName = c.CreatedByName,
                    UpdatedAt = c.UpdatedAt,
                    UpdatedByName = c.UpdatedByName
                })
                .ToListAsync();
        }

        public async Task<ClienteDto?> GetByIdAsync(Guid id)
        {
            var c = await _context.Clientes.FindAsync(id);
            if (c == null) return null;
            return new ClienteDto 
            { 
                Id = c.Id, 
                Nome = c.Nome, 
                Cnpj = c.Cnpj, 
                IsActive = c.IsActive,
                InscricaoEstadual = c.InscricaoEstadual,
                Email = c.Email,
                Cep = c.Cep,
                Logradouro = c.Logradouro,
                Numero = c.Numero,
                Bairro = c.Bairro,
                Cidade = c.Cidade,
                Estado = c.Estado,
                CreatedAt = c.CreatedAt,
                CreatedByName = c.CreatedByName,
                UpdatedAt = c.UpdatedAt,
                UpdatedByName = c.UpdatedByName
            };
        }

        public async Task<ClienteDto> CreateAsync(CreateClienteDto dto)
        {
            var c = new Cliente 
            { 
                Nome = dto.Nome, 
                Cnpj = dto.Cnpj, 
                InscricaoEstadual = dto.InscricaoEstadual,
                Email = dto.Email,
                Cep = dto.Cep,
                Logradouro = dto.Logradouro,
                Numero = dto.Numero,
                Bairro = dto.Bairro,
                Cidade = dto.Cidade,
                Estado = dto.Estado,
                IsActive = true 
            };
            await _context.Clientes.AddAsync(c);
            await _context.SaveChangesAsync();
            return (await GetByIdAsync(c.Id))!;
        }

        public async Task<ClienteDto> UpdateAsync(UpdateClienteDto dto)
        {
            var c = await _context.Clientes.FindAsync(dto.Id);
            if (c == null) throw new Exception("Cliente não encontrado.");
            
            c.Nome = dto.Nome;
            c.Cnpj = dto.Cnpj;
            c.InscricaoEstadual = dto.InscricaoEstadual;
            c.Email = dto.Email;
            c.Cep = dto.Cep;
            c.Logradouro = dto.Logradouro;
            c.Numero = dto.Numero;
            c.Bairro = dto.Bairro;
            c.Cidade = dto.Cidade;
            c.Estado = dto.Estado;
            c.IsActive = dto.IsActive;
            c.UpdatedAt = DateTime.UtcNow;

            _context.Clientes.Update(c);
            await _context.SaveChangesAsync();
            return (await GetByIdAsync(c.Id))!;
        }

        public async Task DeleteAsync(Guid id)
        {
            var c = await _context.Clientes.FindAsync(id);
            if (c != null)
            {
                c.IsDeleted = true;
                c.UpdatedAt = DateTime.UtcNow;
                _context.Clientes.Update(c);
                await _context.SaveChangesAsync();
            }
        }
    }
}
