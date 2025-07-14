using AutoProxy.Api.Entities;
using AutoProxy.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using AutoProxy.Shared.SeedWork;

namespace AutoProxy.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocalProxiesController : ControllerBase
    {
        private readonly ILocalProxyService _service;
        public LocalProxiesController(ILocalProxyService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(Result.Success(result));
        }

        public class CreateLocalProxyRequest
        {
            public long ProxyKeyId { get; set; }
            public string Protocol { get; set; } = null!;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateLocalProxyRequest req)
        {
            var result = await _service.CreateAsync(req.ProxyKeyId, req.Protocol);
            if (result == null) return BadRequest(Result.Failure(null, "Cannot create local proxy"));
            return Ok(Result.Success(result));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var success = await _service.DeleteAsync(id);
            if (!success) return NotFound(Result.Failure(null, "Not found"));
            return Ok(Result.Success(null, "Deleted"));
        }
    }
} 