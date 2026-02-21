using backend.Models.DTOs.User;
using backend.Models.Enums;

namespace backend.Models.DTOs.Booking;

public class AppointmentDetailDto
{
    public Guid AppointmentId { get; set; }
    public DateOnly Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public bool IsBooked { get; set; }
    public AppointmentStatusEnum? Status { get; set; }
    public UserResponseDto BookByUser { get; set; } = null!;
    public string PatientName { get; set; } = null!;
    public bool PatientGender { get; set; } // true is female, false is male
    public string PatientPhone { get; set; } = null!;
    public string PatientEmail { get; set; } = null!;
    public DateOnly PatientDateOfBirth { get; set; }
    public string PatientAddress { get; set; } = null!;
    public string Reason { get; set; } = null!;
    public string? MedicalRecordFileUrl { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}