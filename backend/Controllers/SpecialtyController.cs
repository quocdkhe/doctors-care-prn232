using backend.Models;
using backend.Models.DTOs.Specialty;
using backend.Services.Admin;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/specialties")]
    public class SpecialtyController : ControllerBase
    {
        private readonly ISpecialtyService _specialtyService;

        public SpecialtyController(ISpecialtyService specialtyService)
        {
            _specialtyService = specialtyService;
        }
        [HttpGet]
        public async Task<ActionResult<List<Specialty>>> GetAllSpecialties()
        {
            var specialties = await _specialtyService.GetAllSpecialties();
            return Ok(specialties);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Specialty>> GetSpecialtyById(Guid id)
        {
            var specialty = await _specialtyService.GetSpecialtyById(id);
            if (specialty == null)
            {
                return NotFound();
            }
            return Ok(specialty);
        }
        [HttpPost]
        public async Task<ActionResult<Specialty>> CreateSpecialty([FromBody] SpecialtyDto dto)
        {
            var specialty = new Specialty
            {
                Name = dto.Name,
                Description = dto.Description,
                ImageUrl = dto.ImageUrl
            };
            var createdSpecialty = await _specialtyService.CreateSpecialty(specialty);
            return CreatedAtAction(nameof(GetSpecialtyById), new { id = createdSpecialty.Id }, createdSpecialty);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Specialty>> UpdateSpecialty(Guid id, [FromBody] SpecialtyDto dto)
        {
            var specialty = new Specialty
            {
                Name = dto.Name,
                Description = dto.Description,
                ImageUrl = dto.ImageUrl
            };
            var updatedSpecialty = await _specialtyService.UpdateSpecialty(id, specialty);
            return Ok(updatedSpecialty);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSpecialty(Guid id)
        {
            await _specialtyService.DeleteSpecialty(id);
            return NoContent();
        }
    }
}
