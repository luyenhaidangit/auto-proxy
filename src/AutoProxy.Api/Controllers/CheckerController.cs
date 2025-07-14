using AutoProxy.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using AutoProxy.Shared.SeedWork;

namespace AutoProxy.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CheckerController : ControllerBase
    {
        private readonly ICheckerService _service;
        public CheckerController(ICheckerService service)
        {
            _service = service;
        }

        public class CheckRequest
        {
            public IEnumerable<string> Proxies { get; set; } = null!;
        }

        [HttpPost]
        public async Task<IActionResult> Check([FromBody] CheckRequest req)
        {
            var result = await _service.CheckAsync(req.Proxies);
            return Ok(Result.Success(result));
        }

        [HttpGet("results")]
        public async Task<IActionResult> GetResults()
        {
            var result = await _service.GetLatestResultsAsync();
            return Ok(Result.Success(result));
        }

        [HttpGet("download")]
        public async Task<IActionResult> Download()
        {
            var csv = await _service.DownloadCsvAsync();
            return File(csv, "text/csv", "checker_results.csv");
        }
    }
} 