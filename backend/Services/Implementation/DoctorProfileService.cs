using backend.Models;
using backend.Models.DTOs.Doctor;
using backend.Models.DTOs.User;
using backend.Services.Doctor;
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
    }
}
