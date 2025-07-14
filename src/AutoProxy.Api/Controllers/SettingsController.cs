using AutoProxy.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using AutoProxy.Shared.SeedWork;

namespace AutoProxy.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SettingsController : ControllerBase
    {
        private readonly ISettingsService _service;
        public SettingsController(ISettingsService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _service.GetSettingsAsync();
            return Ok(Result.Success(result));
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] IDictionary<string, string> settings)
        {
            var success = await _service.UpdateSettingsAsync(settings);
            if (!success) return BadRequest(Result.Failure(null, "Update failed"));
            return Ok(Result.Success(null, "Updated"));
        }
    }
} 