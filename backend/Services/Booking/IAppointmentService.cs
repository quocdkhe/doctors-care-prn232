using backend.Models.DTOs.Booking;

namespace backend.Services.Booking
{
    public interface IAppointmentService
    {
        public Task CreateNewAppointment(CreateAppointmentDto dto);
        public Task<List<AppointmentItemDto>> GetAllAppointmentsByMonth(int Month, int Year, Guid doctorId);
        public Task<AppointmentDetailDto?> GetAppointmentDetailById(Guid AppointmentId);
        public Task CancelAppointment(Guid AppointmentId);
        public Task RevokeAppointment(Guid AppointmentId);
        public Task CompleteAppointment(Guid AppointmentId, CompleteAppointmentDto dto);
    }
}
