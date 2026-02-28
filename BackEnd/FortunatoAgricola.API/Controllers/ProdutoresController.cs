using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using FortunatoAgricola.Application.DTOs;
using FortunatoAgricola.Application.Interfaces;

namespace FortunatoAgricola.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutoresController : ControllerBase
    {
        private readonly IProdutorService _produtorService;

        public ProdutoresController(IProdutorService produtorService)
        {
            _produtorService = produtorService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var produtores = await _produtorService.GetAllAsync();
            return Ok(produtores);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var produtor = await _produtorService.GetByIdAsync(id);
            if (produtor == null) return NotFound();
            return Ok(produtor);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateProdutorDto dto)
        {
            var p = await _produtorService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = p.Id }, p);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateProdutorDto dto)
        {
            if (id != dto.Id) return BadRequest("ID divergente.");

            var p = await _produtorService.UpdateAsync(dto);
            return Ok(p);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            // Fake delete rules are handled by the service and EF Core Query Filters
            await _produtorService.DeleteAsync(id);
            return NoContent();
        }
    }
}
