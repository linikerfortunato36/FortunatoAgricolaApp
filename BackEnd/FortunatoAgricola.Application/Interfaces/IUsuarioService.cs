using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FortunatoAgricola.Application.DTOs;

namespace FortunatoAgricola.Application.Interfaces
{
    public interface IUsuarioService
    {
        Task<IEnumerable<UsuarioDto>> GetAllAsync();
        Task<UsuarioDto?> GetByIdAsync(Guid id);
        Task<UsuarioDto> CreateAsync(CreateUsuarioDto dto);
        Task<UsuarioDto> UpdateAsync(UpdateUsuarioDto dto);
        Task DeleteAsync(Guid id);
    }
}
