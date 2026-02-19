using System;

namespace backend.Models.DTOs.Booking;

public class SlotAndDoctorDto
{
    public int SlotId { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public DateOnly Date { get; set; }
    public bool IsBooked { get; set; }
    public string DoctorName { get; set; } = null!;
    public string ImageUrl { get; set; } = null!;
    public string DoctorSlug { get; set; } = null!;
    public int PricePerHour { get; set; }
    public string ClinicAddress { get; set; } = null!;
    public string ClinicName { get; set; } = null!;


}
