using backend.Models.Enums;

namespace backend.Models.DTOs.Booking;

public class AppointmentItemDto
{
    public Guid AppointmentId { get; set; }
    public DateOnly Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public bool IsBooked { get; set; }
    public AppointmentStatusEnum? Status { get; set; }
    public string PatientName { get; set; } = null!;
}