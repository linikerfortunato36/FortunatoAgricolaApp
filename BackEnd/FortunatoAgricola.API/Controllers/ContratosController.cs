using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using FortunatoAgricola.Application.DTOs;
using FortunatoAgricola.Application.Interfaces;

namespace FortunatoAgricola.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContratosController : ControllerBase
    {
        private readonly IContratoService _contratoService;

        public ContratosController(IContratoService contratoService)
        {
            _contratoService = contratoService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var contratos = await _contratoService.GetAllAsync();
            return Ok(contratos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var c = await _contratoService.GetByIdAsync(id);
            if (c == null) return NotFound();
            return Ok(c);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateContratoDto dto)
        {
            var c = await _contratoService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = c.Id }, c);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateContratoDto dto)
        {
            if (id != dto.Id) return BadRequest("ID divergente.");

            var c = await _contratoService.UpdateAsync(dto);
            return Ok(c);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _contratoService.DeleteAsync(id);
            return NoContent();
        }
    }
}
