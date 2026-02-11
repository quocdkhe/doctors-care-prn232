using backend.Models;
using backend.Models.DTOs.Clinic;
using backend.Services.Admin;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/clinics")]
    [ApiController]
    public class ClinicController : ControllerBase
    {
        private readonly IClinicService _clinicService;

        public ClinicController(IClinicService clinicService)
        {
            _clinicService = clinicService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Clinic>>> GetAllClinics()
        {
            var clinics = await _clinicService.GetAllClinics();
            return Ok(clinics);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Clinic>> GetClinicById(Guid id)
        {
            var clinic = await _clinicService.GetClinicById(id);
            if (clinic == null)
            {
                return NotFound();
            }
            return Ok(clinic);
        }

        [HttpPost]
        public async Task<ActionResult<Clinic>> CreateClinic([FromBody] ClinicDto dto)
        {
            var clinic = new Clinic
            {
                Name = dto.Name,
                Description = dto.Description,
                ImageUrl = dto.ImageUrl,
                City = dto.City,
                Address = dto.Address
            };
            var createdClinic = await _clinicService.CreateClinic(clinic);
            return CreatedAtAction(nameof(GetClinicById), new { id = createdClinic.Id }, createdClinic);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Clinic>> UpdateClinic(Guid id, [FromBody] ClinicDto dto)
        {
            var clinic = new Clinic
            {
                Name = dto.Name,
                Description = dto.Description,
                ImageUrl = dto.ImageUrl,
                City = dto.City,
                Address = dto.Address
            };
            var updatedClinic = await _clinicService.UpdateClinic(id, clinic);
            return Ok(updatedClinic);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteClinic(Guid id)
        {
            var result = await _clinicService.DeleteClinic(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
