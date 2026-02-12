using backend.Models;
using backend.Models.DTOs.Doctor;

namespace backend.Services.Doctor
{
    public interface IDoctorProfileService
    {
        Task<CurrentDoctorProfileDto?> GetCurrentDoctorProfile(Guid userId);
    }
}
