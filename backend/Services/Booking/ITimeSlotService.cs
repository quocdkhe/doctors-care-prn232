using backend.Models;
using backend.Models.DTOs.Booking;

namespace backend.Services.Booking
{
    public interface ITimeSlotService
    {
        public Task CreateTimeSlots(Guid DoctorId, List<CreateSlotDto> slots);
        public Task<List<TimeSlot>> GetTimeSlotsByDay(Guid DoctorId, DateOnly day);
        public Task<List<TimeSlot>> DoctorsGetTimeSlotsByWeek(Guid DoctorId, DateOnly mondayOfWeek);
    }
}
