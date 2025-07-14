namespace AutoProxy.Shared.Domains
{
    public interface IEntityBase<T>
    {
        T Id { get; set; }
    }
}
