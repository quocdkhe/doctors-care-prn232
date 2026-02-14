using backend.Models.DTOs.Doctor;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/doctors")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly Services.Doctor.IDoctorProfileService _doctorProfileService;
        public DoctorController(Services.Doctor.IDoctorProfileService doctorProfileService)
        {
            _doctorProfileService = doctorProfileService;
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
    }

}



