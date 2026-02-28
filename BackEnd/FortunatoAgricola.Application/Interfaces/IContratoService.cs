using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FortunatoAgricola.Application.DTOs;

namespace FortunatoAgricola.Application.Interfaces
{
    public interface IContratoService
    {
        Task<IEnumerable<ContratoDto>> GetAllAsync();
        Task<ContratoDto> GetByIdAsync(Guid id);
        Task<ContratoDto> CreateAsync(CreateContratoDto dto);
        Task<ContratoDto> UpdateAsync(UpdateContratoDto dto);
        Task DeleteAsync(Guid id);
    }
}
