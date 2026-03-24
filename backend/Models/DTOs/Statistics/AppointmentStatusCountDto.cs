namespace backend.Models.DTOs.Statistics
{
    public class AppointmentStatusCountDto
    {
        public int Scheduled { get; set; }
        public int Completed { get; set; }
        public int Cancelled { get; set; }
    }
}
