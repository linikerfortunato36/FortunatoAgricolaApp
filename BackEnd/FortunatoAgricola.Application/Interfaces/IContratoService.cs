using FortunatoAgricola.Application.DTOs;

namespace FortunatoAgricola.Application.Interfaces
{
    public interface IContratoService
    {
        Task<IEnumerable<ContratoDto>> GetAllAsync();
        Task<ContratoDto> GetByIdAsync(Guid id);
        Task<ContratoDto> CreateAsync(CreateContratoDto dto);
        Task<ContratoDto> UpdateAsync(UpdateContratoDto dto);
        Task<IEnumerable<ContratoDto>> GetByClienteIdAsync(Guid clienteId);
        Task DeleteAsync(Guid id);
    }
}
