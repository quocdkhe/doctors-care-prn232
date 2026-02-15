namespace backend.Models.DTOs.Booking;

public class CreateSlotDto
{
    public DateOnly Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }

}
