using backend.Models;
using backend.Models.DTOs.Booking;
using backend.Models.DTOs.Doctor;
using backend.Services.Booking;
using backend.Services.Doctor;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/doctors")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorProfileService _doctorProfileService;
        private readonly ITimeSlotService _timeSlotService;
        public DoctorController(IDoctorProfileService doctorProfileService, ITimeSlotService timeSlotService)
        {
            _doctorProfileService = doctorProfileService;
            _timeSlotService = timeSlotService;
        }

        [HttpGet("me")]
        [Authorize(Roles = "Doctor")]
        public async Task<ActionResult<CurrentDoctorProfileDto?>> GetCurrentDoctorProfile()
        {
            var userId = User.GetUserId();
            var doctorProfile = await _doctorProfileService.GetCurrentDoctorProfile(userId);
            return Ok(doctorProfile);
        }

        [HttpPut("me")]
        [Authorize(Roles = "Doctor")]
        public async Task<ActionResult> UpdateCurrentDoctorProfile(UpdateDoctorProfileDto dto)
        {
            var userId = User.GetUserId();
            await _doctorProfileService.UpdateCurrentDoctorProfile(userId, dto);
            return NoContent();
        }

        [HttpGet("{doctorId}/slots")]
        public async Task<ActionResult<List<TimeSlot>>> GetTimeSlotsByDoctorId(Guid doctorId, [FromQuery] DateOnly day)
        {
            return await _timeSlotService.GetTimeSlotsByDay(doctorId, day);
        }

        [HttpPost("me/slots")]
        [Authorize]
        public async Task CreateTimeSlots([FromBody] List<CreateSlotDto> slots)
        {
            var doctorId = User.GetUserId();
            await _timeSlotService.CreateTimeSlots(doctorId, slots);
        }
    }

}



