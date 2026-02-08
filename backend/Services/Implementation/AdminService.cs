using backend.Exceptions;
using backend.Models;
using backend.Models.DTOs.User;
using backend.Models.Enums;
using backend.Services.Admin;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementation
{
    public class AdminService : IAdminService
    {
        private readonly DoctorsCareContext _context;

        public AdminService(DoctorsCareContext context)
        {
            _context = context;
        }

        public async Task AdminCreateUser(AdminCreateUserDto dto)
        {
            // Check if email already exists
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (existingUser != null)
            {
                throw new BadRequestException("Email đã được sử dụng");
            }

            var user = new User
            {
                FullName = dto.FullName,
                Phone = dto.Phone,
                Email = dto.Email,
                Role = dto.Role ?? UserRoleEnum.Patient,
                Password = PasswordHashing.HashPassword("123456"), // default password
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task<List<UserResponseDto>> GetAllUsers()
        {
            return await _context.Users
                .Select(u => new UserResponseDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Phone = u.Phone,
                    Email = u.Email,
                    Avatar = u.Avatar,
                    Role = u.Role
                })
                .ToListAsync();
        }
    }
}
