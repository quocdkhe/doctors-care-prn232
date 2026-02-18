using backend.Exceptions;
using backend.Models;
using backend.Models.DTOs.Doctor;
using backend.Services.Patient;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementation
{
    public class PatientService : IPatientService
    {
        private readonly DoctorsCareContext _context;
        public PatientService(DoctorsCareContext context)
        {
            _context = context;
        }

        public async Task<List<DoctorCard>> GetDoctors(string? SpecialtySlug, string? ClinicSlug, string? City)
        {
            var query = _context.DoctorProfiles
                .Include(d => d.User)
                .Include(d => d.Clinic)
                .Include(d => d.Specialty)
                .AsQueryable();

            if (!string.IsNullOrEmpty(SpecialtySlug))
            {
                query = query.Where(d => d.Specialty.Slug == SpecialtySlug);
            }

            if (!string.IsNullOrEmpty(ClinicSlug))
            {
                query = query.Where(d => d.Clinic.Slug == ClinicSlug);
            }

            if (!string.IsNullOrEmpty(City))
            {
                query = query.Where(d => d.Clinic.City == City);
            }

            return query.Select(d => new DoctorCard
            {
                Slug = d.Slug,
                DoctorName = d.User.FullName,
                ImageUrl = d.User.Avatar,
                ShortDescription = d.ShortDescription,
                PricePerHour = d.PricePerHour,
                ClinicSlug = d.Clinic.Slug,
                ClinicName = d.Clinic.Name,
                ClinicAddress = d.Clinic.Address,
                ClinicCity = d.Clinic.City
            }).ToList();

        }

        public async Task<SpecialtyAndDoctors> GetSpecialtyAndDoctors(string SpecialtySlug)
        {
            var specialty = await _context.Specialties
                .Include(s => s.Doctors).ThenInclude(dp => dp.User)
                .Include(s => s.Doctors).ThenInclude(dp => dp.Clinic)
                .FirstOrDefaultAsync(s => s.Slug == SpecialtySlug)
                ?? throw new NotFoundException("Specialty not found");

            return new SpecialtyAndDoctors
            {
                SpeicaltySlug = specialty.Slug,
                SpecialtyName = specialty.Name,
                SpecialtyDescription = specialty.Description,
                SpeialtyImage = specialty.ImageUrl,
                Doctors = specialty.Doctors.Select(d => new DoctorCard
                {
                    Slug = d.Slug,
                    DoctorName = d.User.FullName,
                    ImageUrl = d.User.Avatar,
                    ShortDescription = d.ShortDescription,
                    PricePerHour = d.PricePerHour,
                    ClinicSlug = d.Clinic.Slug,
                    ClinicName = d.Clinic.Name,
                    ClinicAddress = d.Clinic.Address,
                    ClinicCity = d.Clinic.City
                }).ToList()
            };
        }
    }
}
