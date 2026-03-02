using FortunatoAgricola.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FortunatoAgricola.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BrasilApiController : ControllerBase
    {
        private readonly IBrasilApiService _service;

        public BrasilApiController(IBrasilApiService service)
        {
            _service = service;
        }

        [Authorize]
        [HttpGet("{cnpj}")]
        public async Task<IActionResult> GetAll(string cnpj) => Ok(await _service.GetCNPJ(cnpj));
    }
}
