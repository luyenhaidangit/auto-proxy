using AutoProxy.Api.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AutoProxy.Api.Services.Interfaces
{
    public interface ICheckerService
    {
        Task<IEnumerable<CheckerResult>> CheckAsync(IEnumerable<string> proxies);
        Task<IEnumerable<CheckerResult>> GetLatestResultsAsync();
        Task<byte[]> DownloadCsvAsync();
    }
} 