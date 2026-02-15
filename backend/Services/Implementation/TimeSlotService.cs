using backend.Exceptions;
using backend.Models;
using backend.Models.DTOs.Booking;
using backend.Services.Booking;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementation
{
    public class TimeSlotService : ITimeSlotService
    {
        private readonly DoctorsCareContext _context;

        public TimeSlotService(DoctorsCareContext context)
        {
            _context = context;
        }

        public async Task CreateTimeSlots(Guid DoctorId, List<CreateSlotDto> slots)
        {
            if (slots == null || slots.Count == 0)
            {
                throw new BadRequestException("Danh sách slot không được trống");
            }

            // Get distinct dates from the slots
            var distinctDates = slots.Select(s => s.Date).Distinct().ToList();

            // Delete all old slots for these days and doctor
            var oldSlots = await _context.TimeSlots
                .Where(s => s.DoctorId == DoctorId && distinctDates.Contains(s.Date) && !s.IsBooked)
                .ToListAsync();

            _context.TimeSlots.RemoveRange(oldSlots);

            // Create new slots
            var timeSlots = slots.Select(slot => new TimeSlot
            {
                DoctorId = DoctorId,
                Date = slot.Date,
                StartTime = slot.StartTime,
                EndTime = slot.EndTime,
                IsBooked = false
            }).ToList();

            _context.TimeSlots.AddRange(timeSlots);
            await _context.SaveChangesAsync();
        }

        public async Task<List<TimeSlot>> DoctorsGetTimeSlotsByWeek(Guid DoctorId, DateOnly mondayOfWeek)
        {
            var sundayOfWeek = mondayOfWeek.AddDays(6);

            var slots = await _context.TimeSlots
                .Where(s => s.DoctorId == DoctorId && s.Date >= mondayOfWeek && s.Date <= sundayOfWeek)
                .OrderBy(s => s.Date)
                .ThenBy(s => s.StartTime)
                .ToListAsync();

            return slots;
        }

        public async Task<List<TimeSlot>> GetTimeSlotsByDay(Guid DoctorId, DateOnly day)
        {
            var slots = await _context.TimeSlots
                .Where(s => s.DoctorId == DoctorId && s.Date == day)
                .OrderBy(s => s.StartTime)
                .ToListAsync();

            return slots;
        }
    }
}
