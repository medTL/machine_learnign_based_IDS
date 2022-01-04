namespace TML_ids.Models
{
    public class ServerResponse<T>
    {
        public T Data { get; set; }

        public string? Message { get; set; }
        
        public string? Error { get; set; }
    }
}