using AutoProxy.Api.Persistence;
using AutoProxy.Shared.EntityFrameworkCore.Oracle;

namespace AutoProxy.Api.Extensions
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddConfigurationSettings(this IServiceCollection services, IConfiguration configuration)
        {
            return services;
        }

        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            // Add services to the container.

            services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            // Database context configuration
            services.AddInfrastructureServices();
            services.ConfigureServiceDbContext<AutoProxyDbContext>(configuration, useWallet: true);

            return services;
        }

        private static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
        {
            return services;
        }
    }
} 