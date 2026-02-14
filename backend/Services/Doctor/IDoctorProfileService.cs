using backend.Models.DTOs.Doctor;

namespace backend.Services.Doctor
{
    public interface IDoctorProfileService
    {
        Task<CurrentDoctorProfileDto?> GetCurrentDoctorProfile(Guid userId);
        Task UpdateCurrentDoctorProfile(Guid userId, UpdateDoctorProfileDto dto);
    }
}
