namespace AutoProxy.Api.Extensions
{
    public static class HostExtensions
    {
        public static IApplicationBuilder UseInfrastructure(this WebApplication app)
        {
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            return app;
        }
    }
} 