using AutoProxy.Api.Entities;
using AutoProxy.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using AutoProxy.Shared.SeedWork;

namespace AutoProxy.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProxyKeysController : ControllerBase
    {
        private readonly IProxyKeyService _service;
        public ProxyKeysController(IProxyKeyService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? status, [FromQuery] string? region, [FromQuery] string? provider)
        {
            var result = await _service.GetAllAsync(status, region, provider);
            return Ok(Result.Success(result));
        }

        [HttpPost("bulk")]
        public async Task<IActionResult> AddBulk([FromBody] IEnumerable<ProxyKey> keys, [FromQuery] bool autoCreateLocalProxy = false)
        {
            var result = await _service.AddBulkAsync(keys, autoCreateLocalProxy);
            return Ok(Result.Success(result));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var success = await _service.DeleteAsync(id);
            if (!success) return NotFound(Result.Failure(null, AutoProxy.Shared.Constants.Message.Failure));
            return Ok(Result.Success(null, AutoProxy.Shared.Constants.Message.Success));
        }

        [HttpPost("{id}/rotate")]
        public async Task<IActionResult> Rotate(long id)
        {
            var success = await _service.RotateAsync(id);
            if (!success) return NotFound(Result.Failure(null, AutoProxy.Shared.Constants.Message.Failure));
            return Ok(Result.Success(null, AutoProxy.Shared.Constants.Message.Success));
        }
    }
} 