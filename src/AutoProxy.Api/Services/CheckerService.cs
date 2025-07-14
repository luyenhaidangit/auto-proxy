using AutoProxy.Api.Entities;
using AutoProxy.Api.Persistence;
using AutoProxy.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace AutoProxy.Api.Services
{
    public class CheckerService : ICheckerService
    {
        private readonly AutoProxyDbContext _db;
        public CheckerService(AutoProxyDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<CheckerResult>> CheckAsync(IEnumerable<string> proxies)
        {
            var now = DateTime.UtcNow;
            var results = new List<CheckerResult>();
            var tasks = proxies.Select(async proxy =>
            {
                // Giả lập kiểm tra proxy (có thể thay bằng thực tế)
                var rnd = new Random();
                await Task.Delay(rnd.Next(50, 200));
                var protocol = proxy.Contains(":1080") ? "SOCKS5" : (proxy.Contains(":443") ? "HTTPS" : "HTTP");
                var latency = rnd.Next(30, 500);
                var isAnonymous = rnd.Next(0, 2) == 1;
                var isSuccess = rnd.Next(0, 10) > 1; // 90% thành công
                var result = new CheckerResult
                {
                    Proxy = proxy,
                    Latency = latency,
                    IsAnonymous = isAnonymous,
                    Protocol = protocol,
                    CheckedAt = now,
                    IsSuccess = isSuccess,
                    Remark = isSuccess ? null : "Failed to connect"
                };
                return result;
            });
            results = (await Task.WhenAll(tasks)).ToList();
            await _db.CheckerResults.AddRangeAsync(results);
            await _db.SaveChangesAsync();
            return results;
        }

        public async Task<IEnumerable<CheckerResult>> GetLatestResultsAsync()
        {
            var latest = await _db.CheckerResults.OrderByDescending(x => x.CheckedAt).Take(100).ToListAsync();
            return latest;
        }

        public async Task<byte[]> DownloadCsvAsync()
        {
            var results = await _db.CheckerResults.OrderByDescending(x => x.CheckedAt).Take(100).ToListAsync();
            var csv = new System.Text.StringBuilder();
            csv.AppendLine("Proxy,Latency(ms),IsAnonymous,Protocol,CheckedAt,IsSuccess,Remark");
            foreach (var r in results)
            {
                csv.AppendLine($"{r.Proxy},{r.Latency},{r.IsAnonymous},{r.Protocol},{r.CheckedAt:O},{r.IsSuccess},{r.Remark}");
            }
            return System.Text.Encoding.UTF8.GetBytes(csv.ToString());
        }
    }
} 