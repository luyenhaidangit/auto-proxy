namespace AutoProxy.Api.Persistence
{
    public class AutoProxyDbSeed
    {
        public static async Task InitAsync(SecuritiesDbContext securitiesContext, ILogger logger)
        {
            await SecuritiesSeed.InitAsync(securitiesContext, logger);
        }
    }
}
