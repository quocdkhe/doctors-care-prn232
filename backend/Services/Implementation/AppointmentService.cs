using backend.Models;
using backend.Models.DTOs.Booking;
using backend.Services.Booking;

namespace backend.Services.Implementation
{
    public class AppointmentService : IAppointmentService
    {
        private readonly DoctorsCareContext _context;
        public AppointmentService(DoctorsCareContext context)
        {
            _context = context;
        }

        // public async Task CreateNewAppointment(CreateAppointmentDto dto)
        // {
        //     var appointment = new Appointment
        //     {
        //         TimeSlotId = dto.TimeSlotId,
        //         PatientId = dto.PatientId,
        //     };
        //     await _context.Appointments.AddAsync(appointment);
        //     await _context.SaveChangesAsync();
        // }
    }
}
