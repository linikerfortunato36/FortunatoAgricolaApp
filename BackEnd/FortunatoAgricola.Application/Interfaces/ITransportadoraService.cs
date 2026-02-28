using FortunatoAgricola.Application.DTOs;

namespace FortunatoAgricola.Application.Interfaces
{
    public interface ITransportadoraService
    {
        Task<IEnumerable<TransportadoraDto>> GetAllAsync();
        Task<TransportadoraDto?> GetByIdAsync(Guid id);
        Task<TransportadoraDto> CreateAsync(CreateTransportadoraDto dto);
        Task<TransportadoraDto> UpdateAsync(UpdateTransportadoraDto dto);
        Task DeleteAsync(Guid id);
    }
}
