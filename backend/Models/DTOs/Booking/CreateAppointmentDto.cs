namespace backend.Models.DTOs.Booking
{
    public class CreateAppointmentDto
    {
        public Guid PatientId { get; set; }
        public int TimeSlotId { get; set; }
    }
}
