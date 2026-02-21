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
        private readonly IAppointmentService _appointmentService;
        public DoctorController(IDoctorProfileService doctorProfileService, ITimeSlotService timeSlotService, IAppointmentService appointmentService)
        {
            _doctorProfileService = doctorProfileService;
            _timeSlotService = timeSlotService;
            _appointmentService = appointmentService;
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

        [HttpGet("me/slots")]
        public async Task<ActionResult<List<TimeSlot>>> GetTimeSlotsByDoctorId([FromQuery] DateOnly sundayOfWeek)
        {
            var doctorId = User.GetUserId();
            return await _timeSlotService.DoctorsGetTimeSlotsByWeek(doctorId, sundayOfWeek);
        }

        [HttpPost("me/slots")]
        [Authorize]
        public async Task CreateTimeSlots([FromQuery] DateOnly sundayOfWeek, [FromBody] List<CreateSlotDto> slots)
        {
            var doctorId = User.GetUserId();
            await _timeSlotService.CreateUpdateTimeSlots(doctorId, slots, sundayOfWeek);
        }

        [HttpGet("me/appointments")]
        public async Task<ActionResult<List<AppointmentItemDto>>> GetAppointmentsByDoctorId([FromQuery] int month, [FromQuery] int year)
        {
            var doctorId = User.GetUserId();
            var appointments = await _appointmentService.GetAllAppointmentsByMonth(month, year, doctorId);
            return Ok(appointments);
        }
    }

}



