using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var produtores = await _produtorService.GetAllAsync();
            return Ok(produtores);
        }
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var produtor = await _produtorService.GetByIdAsync(id);
            if (produtor == null) return NotFound();
            return Ok(produtor);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(CreateProdutorDto dto)
        {
            var p = await _produtorService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = p.Id }, p);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateProdutorDto dto)
        {
            if (id != dto.Id) return BadRequest("ID divergente.");

            var p = await _produtorService.UpdateAsync(dto);
            return Ok(p);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _produtorService.DeleteAsync(id);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Erro interno ao excluir produtor.", Details = ex.Message });
            }
        }
    }
}
