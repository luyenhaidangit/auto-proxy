using AutoProxy.Shared.Domains;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoProxy.Api.Entities
{
    [Table("CHECKER_RESULTS")]
    public class CheckerResult : EntityBase<long>
    {
        [Required]
        [Column("PROXY", TypeName = "VARCHAR2(100)")]
        public string Proxy { get; set; } = null!;

        [Column("LATENCY")]
        public int Latency { get; set; }

        [Column("IS_ANONYMOUS")]
        public bool IsAnonymous { get; set; }

        [Required]
        [Column("PROTOCOL", TypeName = "VARCHAR2(20)")]
        public string Protocol { get; set; } = null!;

        [Required]
        [Column("CHECKED_AT")]
        public DateTime CheckedAt { get; set; }

        [Column("IS_SUCCESS")]
        public bool IsSuccess { get; set; }

        [Column("REMARK", TypeName = "VARCHAR2(500)")]
        public string? Remark { get; set; }
    }
} 