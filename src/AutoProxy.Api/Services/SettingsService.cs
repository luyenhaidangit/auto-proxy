using AutoProxy.Api.Persistence;
using AutoProxy.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace AutoProxy.Api.Services
{
    public class SettingsService : ISettingsService
    {
        private readonly AutoProxyDbContext _db;
        public SettingsService(AutoProxyDbContext db)
        {
            _db = db;
        }

        public async Task<IDictionary<string, string>> GetSettingsAsync()
        {
            var keys = new[] { "HttpPortFrom", "HttpPortTo", "SocksPortFrom", "SocksPortTo", "AutoRotateEnabled", "AutoRotateBeforeSec" };
            var configs = await _db.Configs.Where(x => keys.Contains(x.Key)).ToListAsync();
            return configs.ToDictionary(x => x.Key, x => x.Value);
        }

        public async Task<bool> UpdateSettingsAsync(IDictionary<string, string> settings)
        {
            var keys = new[] { "HttpPortFrom", "HttpPortTo", "SocksPortFrom", "SocksPortTo", "AutoRotateEnabled", "AutoRotateBeforeSec" };
            var configs = await _db.Configs.Where(x => keys.Contains(x.Key)).ToListAsync();
            bool changed = false;
            foreach (var key in keys)
            {
                if (settings.ContainsKey(key))
                {
                    var config = configs.FirstOrDefault(x => x.Key == key);
                    if (config != null && config.Value != settings[key])
                    {
                        config.Value = settings[key];
                        _db.Configs.Update(config);
                        changed = true;
                    }
                }
            }
            if (changed)
            {
                await _db.SaveChangesAsync();
            }
            return changed;
        }
    }
} 