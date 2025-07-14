using AutoProxy.Api.Persistence.Seeds;

namespace AutoProxy.Api.Persistence
{
    public class AutoProxyDbSeed
    {
        public static async Task InitAsync(AutoProxyDbContext securitiesContext, ILogger logger)
        {
            await ConfigSeed.InitAsync(securitiesContext, logger);
        }
    }
}
