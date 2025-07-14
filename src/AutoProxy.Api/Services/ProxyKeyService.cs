using AutoProxy.Api.Entities;
using AutoProxy.Api.Persistence;
using AutoProxy.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AutoProxy.Api.Services
{
    public class ProxyKeyService : IProxyKeyService
    {
        private readonly AutoProxyDbContext _db;
        public ProxyKeyService(AutoProxyDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<ProxyKey>> GetAllAsync(string? status = null, string? region = null, string? provider = null)
        {
            var query = _db.ProxyKeys.AsQueryable();
            if (!string.IsNullOrEmpty(status))
                query = query.Where(x => x.Status == status);
            if (!string.IsNullOrEmpty(region))
                query = query.Where(x => x.Region == region);
            if (!string.IsNullOrEmpty(provider))
                query = query.Where(x => x.Provider == provider);
            return await query.ToListAsync();
        }

        public async Task<IEnumerable<ProxyKey>> AddBulkAsync(IEnumerable<ProxyKey> keys, bool autoCreateLocalProxy = false)
        {
            var keyValues = keys.Select(k => k.KeyValue).ToList();
            var existing = await _db.ProxyKeys.Where(x => keyValues.Contains(x.KeyValue)).Select(x => x.KeyValue).ToListAsync();
            var newKeys = keys.Where(k => !existing.Contains(k.KeyValue)).ToList();
            if (newKeys.Count == 0) return new List<ProxyKey>();

            foreach (var key in newKeys)
            {
                key.Status = "Active";
                _db.ProxyKeys.Add(key);
                // Audit log
                _db.AuditLogs.Add(new AuditLog
                {
                    Action = "Add",
                    Entity = nameof(ProxyKey),
                    EntityId = key.KeyValue,
                    Data = System.Text.Json.JsonSerializer.Serialize(key),
                    CreatedAt = DateTime.UtcNow
                });
            }
            await _db.SaveChangesAsync();

            // Auto create local proxy nếu cần
            if (autoCreateLocalProxy)
            {
                // Lấy range port từ config
                int httpFrom = int.Parse(_db.Configs.FirstOrDefault(x => x.Key == "HttpPortFrom")?.Value ?? "7001");
                int httpTo = int.Parse(_db.Configs.FirstOrDefault(x => x.Key == "HttpPortTo")?.Value ?? "7999");
                var usedPorts = _db.LocalProxies.Select(x => x.Port).ToHashSet();
                int nextPort = Enumerable.Range(httpFrom, httpTo - httpFrom + 1).FirstOrDefault(p => !usedPorts.Contains(p));
                foreach (var key in newKeys)
                {
                    if (nextPort > httpTo) break;
                    var localProxy = new LocalProxy
                    {
                        ProxyKeyId = key.Id,
                        Protocol = "HTTP",
                        Port = nextPort++,
                        IsRunning = true
                    };
                    _db.LocalProxies.Add(localProxy);
                    _db.AuditLogs.Add(new AuditLog
                    {
                        Action = "Add",
                        Entity = nameof(LocalProxy),
                        EntityId = localProxy.Port.ToString(),
                        Data = System.Text.Json.JsonSerializer.Serialize(localProxy),
                        CreatedAt = DateTime.UtcNow
                    });
                }
                await _db.SaveChangesAsync();
            }
            return newKeys;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var key = await _db.ProxyKeys.FindAsync(id);
            if (key == null) return false;
            // Xóa local proxy liên quan
            var localProxies = _db.LocalProxies.Where(x => x.ProxyKeyId == id);
            _db.LocalProxies.RemoveRange(localProxies);
            // Audit log local proxy
            foreach (var lp in localProxies)
            {
                _db.AuditLogs.Add(new AuditLog
                {
                    Action = "Delete",
                    Entity = nameof(LocalProxy),
                    EntityId = lp.Port.ToString(),
                    Data = System.Text.Json.JsonSerializer.Serialize(lp),
                    CreatedAt = DateTime.UtcNow
                });
            }
            _db.ProxyKeys.Remove(key);
            _db.AuditLogs.Add(new AuditLog
            {
                Action = "Delete",
                Entity = nameof(ProxyKey),
                EntityId = key.KeyValue,
                Data = System.Text.Json.JsonSerializer.Serialize(key),
                CreatedAt = DateTime.UtcNow
            });
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RotateAsync(long id)
        {
            var key = await _db.ProxyKeys.FindAsync(id);
            if (key == null) return false;
            // Giả lập gọi API vendor xoay IP (ở đây chỉ cập nhật NextChangeIpAt và Status)
            key.NextChangeIpAt = DateTime.UtcNow.AddMinutes(5);
            key.Status = "Rotating";
            _db.ProxyKeys.Update(key);
            _db.AuditLogs.Add(new AuditLog
            {
                Action = "Rotate",
                Entity = nameof(ProxyKey),
                EntityId = key.KeyValue,
                Data = System.Text.Json.JsonSerializer.Serialize(key),
                CreatedAt = DateTime.UtcNow
            });
            await _db.SaveChangesAsync();
            return true;
        }
    }
} 