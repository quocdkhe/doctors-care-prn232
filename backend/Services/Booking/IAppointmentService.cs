using backend.Models.DTOs.Booking;

namespace backend.Services.Booking
{
    public interface IAppointmentService
    {
        public Task CreateNewAppointment(CreateAppointmentDto dto);
        public Task<List<AppointmentItemDto>> GetAllAppointmentsByMonth(int Month, int Year, Guid doctorId);
    }
}
