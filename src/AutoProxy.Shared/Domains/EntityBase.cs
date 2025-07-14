using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoProxy.Shared.Domains
{
    public abstract class EntityBase<TKey> : IEntityBase<TKey>
    {
        [Key]
        [Column("ID")]
        public TKey Id { get; set; }
    }
}
