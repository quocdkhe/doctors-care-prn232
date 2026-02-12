using backend.Exceptions;
using backend.Models;
using backend.Models.DTOs.Doctor;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
    }
}



