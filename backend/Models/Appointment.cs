using backend.Models.Enums;

namespace backend.Models;

public class Appointment
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public int TimeSlotId { get; set; }
    public TimeSlot TimeSlot { get; set; } = null!;
    public AppointmentStatusEnum Status { get; set; }
    public string? MedicalRecordFileUrl { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}
