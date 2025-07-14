using AutoProxy.Api.Entities;

namespace AutoProxy.Api.Services.Interfaces
{
    public interface IProxyKeyService
    {
        Task<IEnumerable<ProxyKey>> GetAllAsync(string? status = null, string? region = null, string? provider = null);
        Task<IEnumerable<ProxyKey>> AddBulkAsync(IEnumerable<ProxyKey> keys, bool autoCreateLocalProxy = false);
        Task<bool> DeleteAsync(long id);
        Task<bool> RotateAsync(long id);
    }
} 