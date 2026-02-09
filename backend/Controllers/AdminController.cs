using backend.Exceptions;
using backend.Models.DTOs.User;
using backend.Services.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpPost("users")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateUser([FromBody] AdminCreateUserDto dto)
        {
            await _adminService.AdminCreateUser(dto);
            return Ok(new { message = "Tạo người dùng thành công" });
        }

        [HttpGet("users")]
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<UserResponseDto>>> GetAllUsers()
        {
            var users = await _adminService.GetAllUsers();
            return Ok(users);
        }

    }
}
