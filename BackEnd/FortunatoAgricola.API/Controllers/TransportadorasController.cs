using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using FortunatoAgricola.Application.DTOs;
using FortunatoAgricola.Application.Interfaces;

namespace FortunatoAgricola.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransportadorasController : ControllerBase
    {
        private readonly ITransportadoraService _service;

        public TransportadorasController(ITransportadoraService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var t = await _service.GetByIdAsync(id);
            return t == null ? NotFound() : Ok(t);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateTransportadoraDto dto)
        {
            var t = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = t.Id }, t);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateTransportadoraDto dto)
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
                return StatusCode(500, new { Message = "Erro interno ao excluir transportadora.", Details = ex.Message });
            }
        }
    }
}
