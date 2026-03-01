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
    public class UsuarioService : IUsuarioService
    {
        private readonly ApplicationDbContext _context;
        public UsuarioService(ApplicationDbContext context) => _context = context;

        private static UsuarioDto ToDto(Usuario u) =>
            new UsuarioDto { 
                Id = u.Id, 
                Nome = u.Nome, 
                Login = u.Login, 
                Perfil = u.Perfil, 
                IsActive = u.IsActive, 
                CreatedAt = u.CreatedAt, 
                UpdatedAt = u.UpdatedAt,
                CreatedByName = u.CreatedByName,
                UpdatedByName = u.UpdatedByName
            };

        public async Task<IEnumerable<UsuarioDto>> GetAllAsync()
        {
            return await _context.Usuarios
                .OrderBy(u => u.Nome)
                .Select(u => new UsuarioDto { 
                    Id = u.Id, 
                    Nome = u.Nome, 
                    Login = u.Login, 
                    Perfil = u.Perfil, 
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt,
                    CreatedByName = u.CreatedByName,
                    UpdatedByName = u.UpdatedByName
                })
                .ToListAsync();
        }

        public async Task<UsuarioDto?> GetByIdAsync(Guid id)
        {
            var u = await _context.Usuarios.FindAsync(id);
            return u == null ? null : ToDto(u);
        }

        public async Task<UsuarioDto> CreateAsync(CreateUsuarioDto dto)
        {
            var u = new Usuario
            {
                Nome = dto.Nome,
                Login = dto.Login,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha),
                Perfil = dto.Perfil,
                IsActive = true
            };
            await _context.Usuarios.AddAsync(u);
            await _context.SaveChangesAsync();
            return ToDto(u);
        }

        public async Task<UsuarioDto> UpdateAsync(UpdateUsuarioDto dto)
        {
            var u = await _context.Usuarios.FindAsync(dto.Id);
            if (u == null) throw new Exception("Usuário não encontrado.");
            u.Nome = dto.Nome;
            u.Login = dto.Login;
            u.Perfil = dto.Perfil;
            u.IsActive = dto.IsActive;
            if (!string.IsNullOrWhiteSpace(dto.NovaSenha))
                u.SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.NovaSenha);
            u.UpdatedAt = DateTime.UtcNow;
            _context.Usuarios.Update(u);
            await _context.SaveChangesAsync();
            return ToDto(u);
        }

        public async Task DeleteAsync(Guid id)
        {
            var hasMovimentacoes = await _context.Movimentacoes.AnyAsync(m => m.VendedorId == id && !m.IsDeleted);
            if (hasMovimentacoes)
            {
                throw new InvalidOperationException("Este usuário possui movimentações (entregas) vinculadas ao seu perfil. Inative-o em vez de excluí-lo.");
            }

            var u = await _context.Usuarios.FindAsync(id);
            if (u != null)
            {
                u.IsDeleted = true;
                u.UpdatedAt = DateTime.UtcNow;
                _context.Usuarios.Update(u);
                await _context.SaveChangesAsync();
            }
        }
    }
}
