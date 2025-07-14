using AutoProxy.Shared.Domains;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoProxy.Api.Entities
{
    [Table("IP_WHITELISTS")]
    public class IpWhiteList : EntityBase<long>
    {
        [Required]
        [ForeignKey("ProxyKey")]
        [Column("PROXY_KEY_ID")]
        public long ProxyKeyId { get; set; }

        public ProxyKey? ProxyKey { get; set; }

        [Required]
        [Column("IP_ADDRESS", TypeName = "VARCHAR2(50)")]
        public string IpAddress { get; set; } = null!;
    }
} 