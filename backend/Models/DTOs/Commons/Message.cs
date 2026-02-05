namespace backend.Models.DTOs.Commons
{
    public class Message
    {
        public string message { get; set; } = null!;
        public Message() { }
        public Message(string message)
        {
            this.message = message;
        }
    }
}
