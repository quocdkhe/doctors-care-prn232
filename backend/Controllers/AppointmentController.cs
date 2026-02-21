using backend.Exceptions;
using backend.Models.DTOs.Booking;
using backend.Services.Booking;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/appointments")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateANewBooking(CreateAppointmentDto dto)
        {
            await _appointmentService.CreateNewAppointment(dto);
            return NoContent();
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<AppointmentDetailDto>> GetAppointmentDetailById(Guid id)
        {
            var appointment = await _appointmentService.GetAppointmentDetailById(id);
            if (appointment == null)
            {
                throw new NotFoundException("Không tìm thấy");
            }

            return Ok(appointment);
        }

        [HttpPatch("{id:guid}/cancel")]
        public async Task<IActionResult> CancelAppointment(Guid id)
        {
            await _appointmentService.CancelAppointment(id);
            return NoContent();
        }

        [HttpDelete("{id:guid}/revoke")]
        public async Task<IActionResult> RevokeAppointment(Guid id)
        {
            await _appointmentService.RevokeAppointment(id);
            return NoContent();
        }

        [HttpPatch("{id:guid}/complete")]
        public async Task<IActionResult> CompleteAppointment(Guid id, CompleteAppointmentDto dto)
        {
            await _appointmentService.CompleteAppointment(id, dto);
            return NoContent();
        }
    }
}
