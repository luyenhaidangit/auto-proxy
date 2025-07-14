using AutoProxy.Shared.Domains;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoProxy.Api.Entities
{
    [Table("AUDIT_LOGS")]
    public class AuditLog : EntityBase<long>
    {
        [Required]
        [Column("ACTION", TypeName = "VARCHAR2(50)")]
        public string Action { get; set; } = null!;

        [Required]
        [Column("ENTITY", TypeName = "VARCHAR2(100)")]
        public string Entity { get; set; } = null!;

        [Required]
        [Column("ENTITY_ID", TypeName = "VARCHAR2(50)")]
        public string EntityId { get; set; } = null!;

        [Column("DATA", TypeName = "CLOB")]
        public string? Data { get; set; }

        [Column("USER", TypeName = "VARCHAR2(100)")]
        public string? User { get; set; }

        [Required]
        [Column("CREATED_AT")]
        public DateTime CreatedAt { get; set; }
    }
} 