using AutoProxy.Api.Entities;
using AutoProxy.Api.Persistence;
using AutoProxy.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Linq;
using System.Text.Json;

namespace AutoProxy.Api.Services
{
    public class LocalProxyService : ILocalProxyService
    {
        private readonly AutoProxyDbContext _db;
        public LocalProxyService(AutoProxyDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<LocalProxy>> GetAllAsync()
        {
            return await _db.LocalProxies.Where(x => x.IsRunning).ToListAsync();
        }

        public async Task<LocalProxy?> CreateAsync(long proxyKeyId, string protocol)
        {
            var key = await _db.ProxyKeys.FindAsync(proxyKeyId);
            if (key == null) return null;
            // Lấy range port theo protocol
            string portFromKey = protocol.ToUpper() == "SOCKS5" ? "SocksPortFrom" : "HttpPortFrom";
            string portToKey = protocol.ToUpper() == "SOCKS5" ? "SocksPortTo" : "HttpPortTo";
            int portFrom = int.Parse(_db.Configs.FirstOrDefault(x => x.Key == portFromKey)?.Value ?? (protocol.ToUpper() == "SOCKS5" ? "3001" : "7001"));
            int portTo = int.Parse(_db.Configs.FirstOrDefault(x => x.Key == portToKey)?.Value ?? (protocol.ToUpper() == "SOCKS5" ? "4999" : "7999"));
            var usedPorts = _db.LocalProxies.Select(x => x.Port).ToHashSet();
            int nextPort = Enumerable.Range(portFrom, portTo - portFrom + 1).FirstOrDefault(p => !usedPorts.Contains(p));
            if (nextPort == 0 || nextPort > portTo) return null;
            var localProxy = new LocalProxy
            {
                ProxyKeyId = proxyKeyId,
                Protocol = protocol.ToUpper(),
                Port = nextPort,
                IsRunning = true
            };
            _db.LocalProxies.Add(localProxy);
            _db.AuditLogs.Add(new AuditLog
            {
                Action = "Add",
                Entity = nameof(LocalProxy),
                EntityId = localProxy.Port.ToString(),
                Data = JsonSerializer.Serialize(localProxy),
                CreatedAt = DateTime.UtcNow
            });
            await _db.SaveChangesAsync();
            return localProxy;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var proxy = await _db.LocalProxies.FindAsync(id);
            if (proxy == null) return false;
            proxy.IsRunning = false;
            _db.LocalProxies.Update(proxy);
            _db.AuditLogs.Add(new AuditLog
            {
                Action = "Delete",
                Entity = nameof(LocalProxy),
                EntityId = proxy.Port.ToString(),
                Data = JsonSerializer.Serialize(proxy),
                CreatedAt = DateTime.UtcNow
            });
            await _db.SaveChangesAsync();
            return true;
        }
    }
} 