using backend.Models.Enums;

namespace backend.Models;

public class Appointment
{
    public Guid Id { get; set; }
    public Guid BookByUserId { get; set; }
    public User BookByUser { get; set; } = null!;
    public string PatientName { get; set; } = null!;
    public bool PatientGender { get; set; } // true is female, false is male
    public string PatientPhone { get; set; } = null!;
    public string PatientEmail { get; set; } = null!;
    public DateOnly PatientDateOfBirth { get; set; }
    public string PatientAddress { get; set; } = null!;
    public string Reason { get; set; } = null!;
    public int TimeSlotId { get; set; }
    public TimeSlot TimeSlot { get; set; } = null!;
    public AppointmentStatusEnum Status { get; set; }
    public string? MedicalRecordFileUrl { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}
