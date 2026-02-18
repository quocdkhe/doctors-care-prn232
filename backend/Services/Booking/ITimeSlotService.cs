using backend.Models;
using backend.Models.DTOs.Booking;

namespace backend.Services.Booking
{
    public interface ITimeSlotService
    {
        public Task CreateUpdateTimeSlots(Guid DoctorId, List<CreateSlotDto> slots, DateOnly sundayOfWeek);
        public Task<List<TimeSlot>> GetTimeSlotsByDay(Guid DoctorId, DateOnly day);
        public Task<List<TimeSlot>> DoctorsGetTimeSlotsByWeek(Guid DoctorId, DateOnly sundayOfWeek);
    }
}
