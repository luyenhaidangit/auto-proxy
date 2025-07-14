using AutoProxy.Shared.Domains;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoProxy.Api.Entities
{
    [Table("PROXY_KEYS")]
    public class ProxyKey : EntityBase<long>
    {
        [Required]
        [Column("KEY_VALUE", TypeName = "VARCHAR2(255)")]
        public string KeyValue { get; set; } = null!;

        [Required]
        [Column("PROVIDER", TypeName = "VARCHAR2(100)")]
        public string Provider { get; set; } = null!;

        [Required]
        [Column("REGION", TypeName = "VARCHAR2(100)")]
        public string Region { get; set; } = null!;

        [Column("EXPIRE_AT")]
        public DateTime? ExpireAt { get; set; }

        [Required]
        [Column("STATUS", TypeName = "VARCHAR2(50)")]
        public string Status { get; set; } = null!;

        [Column("NEXT_CHANGE_IP_AT")]
        public DateTime? NextChangeIpAt { get; set; }

        [Column("NOTE", TypeName = "VARCHAR2(500)")]
        public string? Note { get; set; }
    }
} 