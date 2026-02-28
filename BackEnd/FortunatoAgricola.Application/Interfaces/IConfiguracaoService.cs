using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FortunatoAgricola.Application.DTOs;

namespace FortunatoAgricola.Application.Interfaces
{
    public interface IConfiguracaoService
    {
        Task<ConfiguracaoDto?> GetAsync();
        Task<ConfiguracaoDto> UpdateAsync(UpdateConfiguracaoDto dto);
    }
}
