using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using FortunatoAgricola.Application.DTOs;
using FortunatoAgricola.Application.Interfaces;

namespace FortunatoAgricola.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioService _service;
        public UsuariosController(IUsuarioService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var u = await _service.GetByIdAsync(id);
            return u == null ? NotFound() : Ok(u);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateUsuarioDto dto)
        {
            var u = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = u.Id }, u);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateUsuarioDto dto)
        {
            if (id != dto.Id) return BadRequest("ID divergente.");
            return Ok(await _service.UpdateAsync(dto));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _service.DeleteAsync(id);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Erro interno ao excluir usuário.", Details = ex.Message });
            }
        }
    }
}
