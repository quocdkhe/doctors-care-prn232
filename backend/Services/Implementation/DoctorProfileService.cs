using backend.Exceptions;
using backend.Models;
using backend.Models.DTOs.Doctor;
using backend.Models.DTOs.User;
using backend.Services.Doctor;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementation
{
    public class DoctorProfileService : IDoctorProfileService
    {
        private readonly DoctorsCareContext _context;

        public DoctorProfileService(DoctorsCareContext context)
        {
            _context = context;
        }

        public Task<CurrentDoctorProfileDto?> GetCurrentDoctorProfile(Guid userId)
        {
            return _context.DoctorProfiles
                .AsNoTracking()
                .Include(dp => dp.User)
                .Where(dp => dp.UserId == userId)
                .Select(dp => new CurrentDoctorProfileDto
                {
                    Id = dp.Id,
                    User = new UserResponseDto
                    {
                        Id = dp.User.Id,
                        Phone = dp.User.Phone,
                        FullName = dp.User.FullName,
                        Email = dp.User.Email,
                        Avatar = dp.User.Avatar,
                        Role = dp.User.Role
                    },
                    Biography = dp.Biography,
                    SpecialtyId = dp.SpecialtyId,
                    ClinicId = dp.ClinicId
                })
                .FirstOrDefaultAsync();
        }

        public async Task UpdateCurrentDoctorProfile(Guid userId, UpdateDoctorProfileDto dto)
        {
            var currentDoctor = await _context.DoctorProfiles
                .Include(dp => dp.User)
                .FirstOrDefaultAsync(dp => dp.UserId == userId);

            if (currentDoctor == null)
            {
                throw new NotFoundException("Không tìm thấy thông tin bác sĩ");
            }

            if (dto.clinicId != null)
            {
                currentDoctor.ClinicId = dto.clinicId;
            }

            if (dto.specialtyId != null)
            {
                currentDoctor.SpecialtyId = dto.specialtyId;
            }

            if (dto.FullName != null)
            {
                currentDoctor.User.FullName = dto.FullName;
            }

            if (dto.Phone != null)
            {
                currentDoctor.User.Phone = dto.Phone;
            }

            if (dto.Password != null)
            {
                currentDoctor.User.Password = PasswordHashing.HashPassword(dto.Password);
            }

            if (dto.ImageUrl != null)
            {
                currentDoctor.User.Avatar = dto.ImageUrl;
            }

            if (dto.biography != null)
            {
                currentDoctor.Biography = dto.biography;
            }
            await _context.SaveChangesAsync();
        }
    }
}
