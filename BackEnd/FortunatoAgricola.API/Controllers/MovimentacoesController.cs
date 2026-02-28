using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using FortunatoAgricola.Application.DTOs;
using FortunatoAgricola.Application.Interfaces;

namespace FortunatoAgricola.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovimentacoesController : ControllerBase
    {
        private readonly IMovimentacaoService _movimentacaoService;

        public MovimentacoesController(IMovimentacaoService movimentacaoService)
        {
            _movimentacaoService = movimentacaoService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var movs = await _movimentacaoService.GetAllAsync();
            return Ok(movs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var m = await _movimentacaoService.GetByIdAsync(id);
            if (m == null) return NotFound();
            return Ok(m);
        }

        [HttpGet("by-contrato/{contratoId}")]
        public async Task<IActionResult> GetByContrato(Guid contratoId)
        {
            var movs = await _movimentacaoService.GetByContratoIdAsync(contratoId);
            return Ok(movs);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateMovimentacaoDto dto)
        {
            // Business rule validation: weight calculation happens in service mapping
            var m = await _movimentacaoService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = m.Id }, m);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateMovimentacaoDto dto)
        {
            if (id != dto.Id) return BadRequest("ID divergente.");

            var m = await _movimentacaoService.UpdateAsync(dto);
            return Ok(m);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            // This will execute subtraction in Contrato delivery amount
            await _movimentacaoService.DeleteAsync(id);
            return NoContent();
        }
    }
}
