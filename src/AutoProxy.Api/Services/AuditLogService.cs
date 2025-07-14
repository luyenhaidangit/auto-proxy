using AutoProxy.Api.Entities;
using AutoProxy.Api.Persistence;
using AutoProxy.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace AutoProxy.Api.Services
{
    public class AuditLogService : IAuditLogService
    {
        private readonly AutoProxyDbContext _db;
        public AuditLogService(AutoProxyDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<AuditLog>> GetAllAsync(string? action = null, string? entity = null)
        {
            var query = _db.AuditLogs.AsQueryable();
            if (!string.IsNullOrEmpty(action))
                query = query.Where(x => x.Action == action);
            if (!string.IsNullOrEmpty(entity))
                query = query.Where(x => x.Entity == entity);
            return await query.OrderByDescending(x => x.CreatedAt).Take(500).ToListAsync();
        }
    }
} 