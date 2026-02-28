using FortunatoAgricola.Application.DTOs;

namespace FortunatoAgricola.Application.Interfaces
{
    public interface IClienteService
    {
        Task<IEnumerable<ClienteDto>> GetAllAsync();
        Task<ClienteDto?> GetByIdAsync(Guid id);
        Task<ClienteDto> CreateAsync(CreateClienteDto dto);
        Task<ClienteDto> UpdateAsync(UpdateClienteDto dto);
        Task DeleteAsync(Guid id);
    }
}
