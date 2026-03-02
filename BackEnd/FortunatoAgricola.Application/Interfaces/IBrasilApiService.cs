using FortunatoAgricola.Application.DTOs;

namespace FortunatoAgricola.Application.Interfaces
{
    public interface IBrasilApiService
    {
        public Task<CNPJDto> GetCNPJ(string cnpj);
    }
}
