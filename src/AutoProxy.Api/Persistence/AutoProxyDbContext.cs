using Microsoft.EntityFrameworkCore;
using AutoProxy.Api.Entities;

namespace AutoProxy.Api.Persistence
{
    public class AutoProxyDbContext : DbContext
    {
        public AutoProxyDbContext(DbContextOptions<AutoProxyDbContext> options) : base(options)
        {
        }

        #region DbSet
        public DbSet<ProxyKey> ProxyKeys { get; set; } = null!;
        public DbSet<LocalProxy> LocalProxies { get; set; } = null!;
        public DbSet<CheckerResult> CheckerResults { get; set; } = null!;
        public DbSet<RotationSchedule> RotationSchedules { get; set; } = null!;
        public DbSet<IpWhiteList> IpWhiteLists { get; set; } = null!;
        public DbSet<Config> Configs { get; set; } = null!;
        public DbSet<AuditLog> AuditLogs { get; set; } = null!;
        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(AssemblyReference.Assembly);
        }
    }
}
