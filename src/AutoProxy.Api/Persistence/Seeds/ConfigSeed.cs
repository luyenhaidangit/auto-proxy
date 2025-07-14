using AutoProxy.Api.Entities;

namespace AutoProxy.Api.Persistence.Seeds
{
    public static class ConfigSeed
    {
        public static async Task InitAsync(AutoProxyDbContext autoProxyContext, ILogger logger)
        {
            var configs = new[]
            {
                new Config { Key = "HttpPortFrom", Value = "7001", Description = "Cổng HTTP bắt đầu" },
                new Config { Key = "HttpPortTo", Value = "7999", Description = "Cổng HTTP kết thúc" },
                new Config { Key = "SocksPortFrom", Value = "3001", Description = "Cổng SOCKS bắt đầu" },
                new Config { Key = "SocksPortTo", Value = "4999", Description = "Cổng SOCKS kết thúc" },
                new Config { Key = "AutoRotateEnabled", Value = "true", Description = "Bật auto rotate" },
                new Config { Key = "AutoRotateBeforeSec", Value = "60", Description = "Số giây trước khi rotate" }
            };

            foreach (var config in configs)
            {
                if (!autoProxyContext.Configs.Any(x => x.Key == config.Key))
                {
                    await autoProxyContext.Configs.AddAsync(config);
                    logger.LogInformation($"Seeded config: {config.Key} = {config.Value}");
                }
            }
            await autoProxyContext.SaveChangesAsync();
        }
    }
}
