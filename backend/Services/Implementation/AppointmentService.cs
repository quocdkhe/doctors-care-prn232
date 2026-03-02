using backend.Exceptions;
using backend.Models;
using backend.Models.DTOs.Booking;
using backend.Models.DTOs.User;
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

        public async Task CancelAppointment(Guid AppointmentId)
        {
            var current = await _context.Appointments.FirstOrDefaultAsync(a => a.Id == AppointmentId);
            if (current == null)
            {
                throw new NotFoundException("Không tìm thấy");
            }
            current.Status = Models.Enums.AppointmentStatusEnum.Cancelled;
            await _context.SaveChangesAsync();
        }

        public async Task CompleteAppointment(Guid AppointmentId, CompleteAppointmentDto dto)
        {
            var current = await _context.Appointments.FirstOrDefaultAsync(a => a.Id == AppointmentId);
            if (current == null)
            {
                throw new NotFoundException("Không tìm thấy");
            }
            current.Status = Models.Enums.AppointmentStatusEnum.Completed;
            current.MedicalRecordFileUrl = dto.MedicalRecordFileUrl;
            await _context.SaveChangesAsync();
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
                    Status = ts.Appointment != null ? ts.Appointment.Status : null,
                    PatientName = ts.Appointment != null ? ts.Appointment.PatientName : string.Empty
                })
                .ToListAsync();
        }

        public async Task<AppointmentDetailDto?> GetAppointmentDetailById(Guid AppointmentId)
        {
            return await _context.Appointments
                .AsNoTracking()
                .Where(a => a.Id == AppointmentId)
                .Select(a => new AppointmentDetailDto
                {
                    AppointmentId = a.Id,
                    Date = a.TimeSlot.Date,
                    StartTime = a.TimeSlot.StartTime,
                    EndTime = a.TimeSlot.EndTime,
                    IsBooked = a.TimeSlot.IsBooked,
                    Status = a.Status,
                    BookByUser = new UserResponseDto
                    {
                        Id = a.BookByUser.Id,
                        FullName = a.BookByUser.FullName,
                        Phone = a.BookByUser.Phone,
                        Email = a.BookByUser.Email,
                        Avatar = a.BookByUser.Avatar,
                        Role = a.BookByUser.Role
                    },
                    PatientName = a.PatientName,
                    PatientGender = a.PatientGender,
                    PatientPhone = a.PatientPhone,
                    PatientEmail = a.PatientEmail,
                    PatientDateOfBirth = a.PatientDateOfBirth,
                    PatientAddress = a.PatientAddress,
                    Reason = a.Reason,
                    MedicalRecordFileUrl = a.MedicalRecordFileUrl,
                    UpdatedAt = a.UpdatedAt,
                    CreatedAt = a.CreatedAt
                })
                .FirstOrDefaultAsync();
        }

        public async Task RevokeAppointment(Guid AppointmentId)
        {
            var appointment = await _context.Appointments.FirstOrDefaultAsync(a => a.Id == AppointmentId);
            if (appointment == null)
            {
                throw new NotFoundException("Không tìm thấy");
            }

            var timeSlot = await _context.TimeSlots.FirstOrDefaultAsync(ts => ts.Id == appointment.TimeSlotId);
            if (timeSlot != null)
            {
                timeSlot.IsBooked = false;
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
        }

        
    }
}
