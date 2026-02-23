using System;
using backend.Models.Enums;

namespace backend.Models.DTOs.Booking;

public class PatientAppointmentDto
{
    public string DoctorName { get; set; } = null!;
    public string DoctorAvatar { get; set; } = null!;
    public string ClinicName { get; set; } = null!;
    public string ClinicAddress { get; set; } = null!;
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public DateOnly Date { get; set; }
    public AppointmentStatusEnum Status { get; set; }
    public string Reason { get; set; } = null!;
    public string? MedicalRecordFileUrl { get; set; }
    public string PatientName { get; set; } = null!;
    public bool PatientGender { get; set; } // true is female, false is male
    public string PatientPhone { get; set; } = null!;
    public DateOnly PatientDateOfBirth { get; set; }
    public string PatientAddress { get; set; } = null!;
}
