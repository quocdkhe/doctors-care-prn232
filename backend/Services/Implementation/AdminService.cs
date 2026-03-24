using backend.Exceptions;
using backend.Models;
using backend.Models.DTOs.Statistics;
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
            var createdUser = await _context.Users.AddAsync(user);

            if (dto.Role == UserRoleEnum.Doctor)
            {
                string baseSlug = VietnameseSlugGenerator.ToSlug(dto.FullName);
                var existingSlugs = await _context.DoctorProfiles
                    .Where(s => s.Slug.StartsWith(baseSlug))
                    .Select(s => s.Slug)
                    .ToListAsync();
                string uniqueSlug = VietnameseSlugGenerator.GenerateUniqueSlug(baseSlug, existingSlugs.ToArray());

                _context.DoctorProfiles.Add(new DoctorProfile
                {
                    User = createdUser.Entity,
                    Slug = uniqueSlug,
                });
            }

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

        public async Task<StatisticsDto> GetStatistics()
        {
            var totalUsers = await _context.Users.CountAsync(u => u.Role == UserRoleEnum.Patient);
            var totalDoctors = await _context.Users.CountAsync(u => u.Role == UserRoleEnum.Doctor);
            var totalAppointments = await _context.Appointments.CountAsync();

            var scheduled = await _context.Appointments.CountAsync(a => a.Status == AppointmentStatusEnum.Scheduled);
            var completed = await _context.Appointments.CountAsync(a => a.Status == AppointmentStatusEnum.Completed);
            var cancelled = await _context.Appointments.CountAsync(a => a.Status == AppointmentStatusEnum.Cancelled);

            return new StatisticsDto
            {
                TotalUsers = totalUsers,
                TotalDoctors = totalDoctors,
                TotalAppointments = totalAppointments,
                AppointmentStatusCount = new AppointmentStatusCountDto
                {
                    Scheduled = scheduled,
                    Completed = completed,
                    Cancelled = cancelled
                }
            };
        }
    }
}
