using FortunatoAgricola.Application.DTOs;
using FortunatoAgricola.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace FortunatoAgricola.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConfiguracoesController : ControllerBase
    {
        private readonly IConfiguracaoService _service;
        public ConfiguracoesController(IConfiguracaoService service) => _service = service;
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var c = await _service.GetAsync();
            return c == null ? NotFound("Nenhuma configuração encontrada.") : Ok(c);
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Save(UpdateConfiguracaoDto dto)
        {
            return Ok(await _service.UpdateAsync(dto));
        }
    }
}
