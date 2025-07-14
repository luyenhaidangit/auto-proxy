using AutoProxy.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using AutoProxy.Shared.SeedWork;

namespace AutoProxy.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuditLogsController : ControllerBase
    {
        private readonly IAuditLogService _service;
        public AuditLogsController(IAuditLogService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? action, [FromQuery] string? entity)
        {
            var result = await _service.GetAllAsync(action, entity);
            return Ok(Result.Success(result));
        }
    }
} 