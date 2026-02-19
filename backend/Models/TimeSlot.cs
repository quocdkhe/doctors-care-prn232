using System;

namespace backend.Models;

public class TimeSlot
{
    public int Id { get; set; }
    public Guid DoctorId { get; set; }
    public User Doctor { get; set; } = null!;
    public DateOnly Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public bool IsBooked { get; set; }
}
