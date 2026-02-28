using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FortunatoAgricola.Application.DTOs;

namespace FortunatoAgricola.Application.Interfaces
{
    public interface IProdutorService
    {
        Task<IEnumerable<ProdutorDto>> GetAllAsync();
        Task<ProdutorDto> GetByIdAsync(Guid id);
        Task<ProdutorDto> CreateAsync(CreateProdutorDto dto);
        Task<ProdutorDto> UpdateAsync(UpdateProdutorDto dto);
        Task DeleteAsync(Guid id);
    }
}
