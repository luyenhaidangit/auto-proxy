using System.Collections.Generic;
using System.Threading.Tasks;

namespace AutoProxy.Api.Services.Interfaces
{
    public interface ISettingsService
    {
        Task<IDictionary<string, string>> GetSettingsAsync();
        Task<bool> UpdateSettingsAsync(IDictionary<string, string> settings);
    }
} 