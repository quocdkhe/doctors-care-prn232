using backend.Models.DTOs.Doctor;

namespace backend.Services.Patient
{
    public interface IPatientService
    {
        public Task<SpecialtyAndDoctors> GetSpecialtyAndDoctors(string SpectialtySlug);
        public Task<List<DoctorCard>> GetDoctors(string? SpecialtySlug, string? ClinicSlug, string? City);
    }
}
