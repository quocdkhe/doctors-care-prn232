using backend.Models;
using backend.Models.DTOs.User;
using backend.Models.Enums;
using backend.Services.Patient;

namespace backend.Services.Implementation
{
    public class PatientService : IPatientService
    {
        private readonly DoctorsCareContext _context;

        public PatientService(DoctorsCareContext context)
        {
            _context = context;
        }

        public async Task<User> Register(RegisterDto dto)
        {
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            var userEntity = await _context.Users.AddAsync(new User
            {
                FullName = dto.FullName,
                Phone = dto.Phone,
                Email = dto.Email,
                Password = hashedPassword,
                Role = UserRoleEnum.Patient,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
            return userEntity.Entity;
        }
    }
}
