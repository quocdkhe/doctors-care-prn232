using backend.Exceptions;
using backend.Models.DTOs.User;
using backend.Services.Account;
using backend.Services.Authentication;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/accounts")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly IAuthService _authService;
        private readonly ITokenService _tokenService;
        public AccountController(IAccountService accountService, IAuthService authService, ITokenService tokenService)
        {
            _accountService = accountService;
            _authService = authService;
            _tokenService = tokenService;
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserResponseDto>> GetCurrentUser()
        {
            // 1. Get user id from HttpContext (set by authentication middleware)
            var userId = User.GetUserId();

            // 2. Get user from database
            var currentUser = await _authService.GetUserById(userId);
            if (currentUser == null)
            {
                throw new NotFoundException("User not found");
            }
            return Ok(new UserResponseDto
            {
                Id = currentUser.Id,
                FullName = currentUser.FullName,
                Phone = currentUser.Phone,
                Email = currentUser.Email,
                Avatar = currentUser.Avatar,
                Role = currentUser.Role
            });
        }

        [HttpPut("me")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UserUpdateProfileDto dto)
        {
            // 1. Get user id from HttpContext (set by authentication middleware)
            var userId = User.GetUserId();
            // 2. Update user profile
            await _accountService.UpdateProfile(userId, dto);
            return Ok(new { message = "Cập nhật hồ sơ thành công" });
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserResponseDto>> Register([FromBody] RegisterDto registerDto)
        {
            // 1. Check if user with the same email already exists
            var existingUser = await _authService.GetUserByEmail(registerDto.Email);
            if (existingUser != null)
            {
                throw new BadRequestException("Email đã được sử dụng");
            }
            // 2. Register new user
            var newUser = await _accountService.Register(registerDto);

            // 3. Generate tokens
            var accessToken = _tokenService.GenerateAccessToken(newUser);
            var refreshToken = _tokenService.GenerateRefreshToken();

            // 4. Save refresh token to database
            await _tokenService.SaveRefreshToken(newUser.Id, refreshToken);

            // 5. Set HTTP-only cookies
            SetTokenCookies.SetTokenCookiesToResponse(Response, accessToken, refreshToken);

            return Ok(new UserResponseDto
            {
                Id = newUser.Id,
                FullName = newUser.FullName,
                Phone = newUser.Phone,
                Email = newUser.Email,
                Avatar = newUser.Avatar,
                Role = newUser.Role
            });
        }
    }
}
