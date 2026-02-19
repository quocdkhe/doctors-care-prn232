using backend.Models.DTOs.Booking;
using backend.Services.Booking;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public BookingController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        [HttpPost("appointments")]
        public async Task<IActionResult> CreateANewBooking(CreateAppointmentDto dto)
        {
            await _appointmentService.CreateNewAppointment(dto);
            return NoContent();
        }

    }
}
