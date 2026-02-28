using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FortunatoAgricola.Application.DTOs;

namespace FortunatoAgricola.Application.Interfaces
{
    public interface IMovimentacaoService
    {
        Task<IEnumerable<MovimentacaoDto>> GetAllAsync();
        Task<IEnumerable<MovimentacaoDto>> GetByContratoIdAsync(Guid contratoId);
        Task<MovimentacaoDto> GetByIdAsync(Guid id);
        Task<MovimentacaoDto> CreateAsync(CreateMovimentacaoDto dto);
        Task<MovimentacaoDto> UpdateAsync(UpdateMovimentacaoDto dto);
        Task DeleteAsync(Guid id);
    }
}
