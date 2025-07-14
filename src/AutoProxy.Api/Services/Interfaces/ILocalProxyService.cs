using AutoProxy.Api.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AutoProxy.Api.Services.Interfaces
{
    public interface ILocalProxyService
    {
        Task<IEnumerable<LocalProxy>> GetAllAsync();
        Task<LocalProxy?> CreateAsync(long proxyKeyId, string protocol);
        Task<bool> DeleteAsync(long id);
    }
} 