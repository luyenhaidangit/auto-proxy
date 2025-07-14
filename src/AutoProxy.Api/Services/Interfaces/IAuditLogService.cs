using AutoProxy.Api.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AutoProxy.Api.Services.Interfaces
{
    public interface IAuditLogService
    {
        Task<IEnumerable<AuditLog>> GetAllAsync(string? action = null, string? entity = null);
    }
} 