using backend.Models;
using backend.Models.DTOs.Booking;
using backend.Services.Booking;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementation
{
    public class AppointmentService : IAppointmentService
    {
        private readonly DoctorsCareContext _context;
        public AppointmentService(DoctorsCareContext context)
        {
            _context = context;
        }

        public async Task CreateNewAppointment(CreateAppointmentDto dto)
        {
            var appointment = new Appointment
            {
                TimeSlotId = dto.TimeSlotId,
                BookByUserId = dto.BookByUserId,
                PatientName = dto.PatientName,
                PatientGender = dto.PatientGender,
                PatientPhone = dto.PatientPhone,
                PatientEmail = dto.PatientEmail,
                PatientDateOfBirth = dto.PatientDateOfBirth,
                PatientAddress = dto.PatientAddress,
                Reason = dto.Reason,
                Status = Models.Enums.AppointmentStatusEnum.Scheduled
            };
            var slot = await _context.TimeSlots.FirstOrDefaultAsync(ts => ts.Id == dto.TimeSlotId);
            slot.IsBooked = true;
            await _context.Appointments.AddAsync(appointment);
            await _context.SaveChangesAsync();
        }

        public Task<List<AppointmentItemDto>> GetAllAppointmentsByMonth(int Month, int Year, Guid doctorId)
        {
            return _context.TimeSlots
                .Where(ts => ts.DoctorId == doctorId && ts.Date.Month == Month && ts.Date.Year == Year)
                .Include(ts => ts.Appointment)
                .Select(ts => new AppointmentItemDto
                {
                    AppointmentId = ts.Appointment != null ? ts.Appointment.Id : Guid.Empty,
                    Date = ts.Date,
                    StartTime = ts.StartTime,
                    EndTime = ts.EndTime,
                    IsBooked = ts.IsBooked,
                    Status = ts.Appointment != null ? ts.Appointment.Status : null
                })
                .ToListAsync();
        }
    }
}
