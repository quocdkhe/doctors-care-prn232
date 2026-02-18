using backend.Models.DTOs.Doctor;
using backend.Services.Patient;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public PatientController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        [HttpGet("specialties/{slug}/doctors")]
        public async Task<ActionResult<List<SpecialtyAndDoctors>>> GetSpecialtyAndDoctors(string slug)
        {
            var result = await _patientService.GetSpecialtyAndDoctors(slug);
            return Ok(result);
        }

        [HttpGet("doctors")]
        public async Task<ActionResult<List<DoctorCard>>> GetDoctors([FromQuery] string? specialtySlug, [FromQuery] string? clinicSlug, [FromQuery] string? city)
        {
            var result = await _patientService.GetDoctors(specialtySlug, clinicSlug, city);
            return Ok(result);
        }
    }
}
