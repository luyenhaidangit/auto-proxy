using System.Collections.Generic;
using System.Threading.Tasks;

namespace AutoProxy.Api.Services.Interfaces
{
    public interface IExportService
    {
        Task<byte[]> ExportProxyKeysAsync(IEnumerable<string> fields, string format = "csv");
    }
} 