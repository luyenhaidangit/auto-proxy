using Microsoft.EntityFrameworkCore;

namespace AutoProxy.Api.Persistence
{
    public class AutoProxyDbContext : DbContext
    {
        public AutoProxyDbContext(DbContextOptions<AutoProxyDbContext> options) : base(options)
        {
        }

        #region DbSet
        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(AssemblyReference.Assembly);

        }
    }
}
