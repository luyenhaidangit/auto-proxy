using AutoProxy.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AutoProxy.Api.Controllers
{
    [ApiController]
    [Route("api/proxykeys/export")]
    public class ProxyKeysExportController : ControllerBase
    {
        private readonly IExportService _service;
        public ProxyKeysExportController(IExportService service)
        {
            _service = service;
        }

        public class ExportRequest
        {
            public IEnumerable<string> Fields { get; set; } = null!;
            public string Format { get; set; } = "csv";
        }

        [HttpPost]
        public async Task<IActionResult> Export([FromBody] ExportRequest req)
        {
            var file = await _service.ExportProxyKeysAsync(req.Fields, req.Format);
            var contentType = req.Format.ToLower() == "txt" ? "text/plain" : "text/csv";
            var fileName = req.Format.ToLower() == "txt" ? "proxykeys.txt" : "proxykeys.csv";
            return File(file, contentType, fileName);
        }
    }
} 