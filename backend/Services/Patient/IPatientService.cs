using backend.Models.DTOs.Booking;
using backend.Models.DTOs.Clinic;
using backend.Models.DTOs.Doctor;

namespace backend.Services.Patient
{
    public interface IPatientService
    {
        public Task<SpecialtyDetailDto> GetSpecialtyDetail(string SpecialtySlug);
        public Task<List<DoctorCard>> GetDoctors(string? SpecialtySlug, string? ClinicSlug, string? City, DateOnly? Date);
        public Task<DoctorDetailDto> GetDoctorDetail(string Slug);
        public Task<SlotAndDoctorDto> GetSlotDetail(int SlotId);
        public Task<ClinicDetailDto> GetClinicDetail(string ClinicSlug);
    }
}
