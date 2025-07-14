using AutoProxy.Api.Persistence;
using AutoProxy.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace AutoProxy.Api.Services
{
    public class ExportService : IExportService
    {
        private readonly AutoProxyDbContext _db;
        public ExportService(AutoProxyDbContext db)
        {
            _db = db;
        }

        public async Task<byte[]> ExportProxyKeysAsync(IEnumerable<string> fields, string format = "csv")
        {
            var fieldList = fields.Select(f => f.ToLower()).ToList();
            var proxyKeys = await _db.ProxyKeys.ToListAsync();
            var localProxies = await _db.LocalProxies.ToListAsync();
            var lines = new List<string>();
            // Header
            lines.Add(string.Join(",", fieldList));
            foreach (var key in proxyKeys)
            {
                var values = new List<string>();
                foreach (var field in fieldList)
                {
                    switch (field)
                    {
                        case "id": values.Add(key.Id.ToString()); break;
                        case "keyvalue": values.Add(key.KeyValue); break;
                        case "provider": values.Add(key.Provider); break;
                        case "region": values.Add(key.Region); break;
                        case "expireat": values.Add(key.ExpireAt?.ToString("O") ?? ""); break;
                        case "status": values.Add(key.Status); break;
                        case "nextchangeipat": values.Add(key.NextChangeIpAt?.ToString("O") ?? ""); break;
                        case "note": values.Add(key.Note ?? ""); break;
                        case "localproxy":
                            var lp = localProxies.FirstOrDefault(x => x.ProxyKeyId == key.Id && x.IsRunning);
                            values.Add(lp != null ? $"127.0.0.1:{lp.Port} ({lp.Protocol})" : "");
                            break;
                        default: values.Add(""); break;
                    }
                }
                lines.Add(string.Join(",", values));
            }
            var content = string.Join("\n", lines);
            if (format.ToLower() == "txt")
            {
                content = string.Join("\n", lines.Skip(1)); // TXT không có header
            }
            return System.Text.Encoding.UTF8.GetBytes(content);
        }
    }
} 