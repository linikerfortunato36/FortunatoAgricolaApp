using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using FortunatoAgricola.Application.DTOs;
using FortunatoAgricola.Application.Interfaces;

namespace FortunatoAgricola.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConfiguracoesController : ControllerBase
    {
        private readonly IConfiguracaoService _service;
        public ConfiguracoesController(IConfiguracaoService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var c = await _service.GetAsync();
            return c == null ? NotFound("Nenhuma configuração encontrada.") : Ok(c);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateConfiguracaoDto dto)
        {
            if (id != dto.Id) return BadRequest("ID divergente.");
            return Ok(await _service.UpdateAsync(dto));
        }
    }
}
