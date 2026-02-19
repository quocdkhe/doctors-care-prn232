namespace backend.Models.DTOs.Booking
{
    public class CreateAppointmentDto
    {
        public Guid BookByUserId { get; set; }
        public int TimeSlotId { get; set; }
        public string PatientName { get; set; } = null!;
        public bool PatientGender { get; set; }
        public string PatientPhone { get; set; } = null!;
        public string PatientEmail { get; set; } = null!;
        public DateOnly PatientDateOfBirth { get; set; }
        public string PatientAddress { get; set; } = null!;
        public string Reason { get; set; } = null!;
    }
}
