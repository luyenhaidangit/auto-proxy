using AutoProxy.Shared.Domains;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoProxy.Api.Entities
{
    [Table("LOCAL_PROXIES")]
    public class LocalProxy : EntityBase<long>
    {
        [Required]
        [ForeignKey("ProxyKey")]
        [Column("PROXY_KEY_ID")]
        public long ProxyKeyId { get; set; }

        public ProxyKey? ProxyKey { get; set; }

        [Required]
        [Column("PROTOCOL", TypeName = "VARCHAR2(20)")]
        public string Protocol { get; set; } = null!;

        [Required]
        [Column("PORT")]
        public int Port { get; set; }

        [Required]
        [Column("IS_RUNNING")]
        public bool IsRunning { get; set; }
    }
} 