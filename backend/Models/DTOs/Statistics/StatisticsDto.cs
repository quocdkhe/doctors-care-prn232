namespace backend.Models.DTOs.Statistics
{
    public class StatisticsDto
    {
        public int TotalUsers { get; set; }
        public int TotalDoctors { get; set; }
        public int TotalAppointments { get; set; } = 0;
        public AppointmentStatusCountDto AppointmentStatusCount { get; set; } = null!;
    }
}
