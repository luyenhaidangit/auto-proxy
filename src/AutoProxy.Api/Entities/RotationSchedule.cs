using AutoProxy.Shared.Domains;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoProxy.Api.Entities
{
    [Table("ROTATION_SCHEDULES")]
    public class RotationSchedule : EntityBase<long>
    {
        [Required]
        [ForeignKey("ProxyKey")]
        [Column("PROXY_KEY_ID")]
        public long ProxyKeyId { get; set; }

        public ProxyKey? ProxyKey { get; set; }

        [Required]
        [Column("ROTATE_INTERVAL_SEC")]
        public int RotateIntervalSec { get; set; }

        [Required]
        [Column("NEXT_ROTATE_AT")]
        public DateTime NextRotateAt { get; set; }
    }
} 