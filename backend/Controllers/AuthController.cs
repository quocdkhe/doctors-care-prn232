using backend.Exceptions;
using backend.Models.DTOs.Commons;
using backend.Models.DTOs.User;
using backend.Services.Authentication;
using backend.Services.Patient;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly IAuthService _authService;
        private readonly ITokenService _tokenService;
        private readonly IPatientService _patientService;
        public AuthController(IAuthService authService, ITokenService tokenService, IPatientService patientService)
        {
            _authService = authService;
            _tokenService = tokenService;
            _patientService = patientService;
        }


        [HttpPost("login")]
        public async Task<ActionResult<UserResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            // 1. Find user by email
            var currentUser = await _authService.GetUserByEmail(loginDto.Email);
            // 2. Verify
            if (currentUser == null || !Utils.PasswordHashing.VerifyPassword(loginDto.Password, currentUser.Password))
            {
                throw new NotFoundException("Không tìm thấy thông tin tài khoản");
            }

            // 3. Generate tokens
            var accessToken = _tokenService.GenerateAccessToken(currentUser);
            var refreshToken = _tokenService.GenerateRefreshToken();

            // 4. Save refresh token to database
            await _tokenService.SaveRefreshToken(currentUser.Id, refreshToken);

            // 5. Set HTTP-only cookies
            SetTokenCookies.SetTokenCookiesToResponse(Response, accessToken, refreshToken);

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

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            // 1. Get refresh token from cookie
            var refreshToken = Request.Cookies["refresh_token"];
            if (!string.IsNullOrEmpty(refreshToken))
            {
                // 2. Validate refresh token from database
                var storedToken = await _tokenService.GetValidRefreshToken(refreshToken);
                if (storedToken != null)
                {
                    // 3. Revoke the refresh token
                    await _tokenService.RevokeToken(storedToken.Id);
                }
            }
            // 4. Remove cookies
            Response.Cookies.Delete("access_token");
            Response.Cookies.Delete("refresh_token");
            return Ok(new Message("Đăng xuất thành công"));
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            // 1. Get refresh token from cookie
            var refreshToken = Request.Cookies["refresh_token"];

            if (string.IsNullOrEmpty(refreshToken))
                throw new UnauthorizedException("Refresh token is missing");

            // 2. Validate refresh token from database
            var storedToken = await _tokenService.GetValidRefreshToken(refreshToken);

            if (storedToken == null)
                throw new UnauthorizedException("Invalid or expired refresh token");

            // 3. Get user from database
            var currentUser = await _authService.GetUserById(storedToken.UserId);

            if (currentUser == null)
                throw new NotFoundException("User not found");

            // 4. Generate new tokens
            var newAccessToken = _tokenService.GenerateAccessToken(currentUser);
            var newRefreshToken = _tokenService.GenerateRefreshToken();

            // 5. Revoke old refresh token and save new one
            await _tokenService.RevokeToken(storedToken.Id);
            await _tokenService.SaveRefreshToken(currentUser.Id, newRefreshToken);

            // 6. Set new cookies
            SetTokenCookies.SetTokenCookiesToResponse(Response, newAccessToken, newRefreshToken);

            return Ok(new { message = "Tokens refreshed successfully" });
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
            var newUser = await _patientService.Register(registerDto);
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
    }
}
