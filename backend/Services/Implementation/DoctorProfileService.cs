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
                    ClinicId = dp.ClinicId,
                    PricePerHour = dp.PricePerHour,
                    ShortDescription = dp.ShortDescription
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

            if (dto.ClinicId != null)
            {
                currentDoctor.ClinicId = dto.ClinicId;
            }

            if (dto.SpecialtyId != null)
            {
                currentDoctor.SpecialtyId = dto.SpecialtyId;
            }

            if (!string.IsNullOrEmpty(dto.FullName))
            {
                currentDoctor.User.FullName = dto.FullName;
            }

            if (!string.IsNullOrEmpty(dto.Phone))
            {
                currentDoctor.User.Phone = dto.Phone;
            }

            if (!string.IsNullOrEmpty(dto.Password))
            {
                currentDoctor.User.Password = PasswordHashing.HashPassword(dto.Password);
            }

            if (!string.IsNullOrEmpty(dto.ImageUrl))
            {
                currentDoctor.User.Avatar = dto.ImageUrl;
            }

            if (!string.IsNullOrEmpty(dto.Biography))
            {
                currentDoctor.Biography = dto.Biography;
            }

            if (dto.PricePerHour > 0)
            {
                currentDoctor.PricePerHour = dto.PricePerHour;
            }

            if (!string.IsNullOrEmpty(dto.ShortDescription))
            {
                currentDoctor.ShortDescription = dto.ShortDescription;
            }
            await _context.SaveChangesAsync();
        }
    }
}
