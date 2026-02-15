namespace backend.Models.DTOs.Booking
{
    public class CreateAppointmentDto
    {
        public Guid DoctorId { get; set; }
        public int TimeSlotId { get; set; }

    }
}
