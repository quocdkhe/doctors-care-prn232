using backend.Exceptions;
using backend.Models;
using backend.Models.DTOs.Booking;
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

        public async Task<List<DoctorCard>> GetDoctors(string? SpecialtySlug, string? ClinicSlug, string? City, DateOnly? Date)
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

            if (Date != null)
            {
                query = query
                    .Include(d => d.User).ThenInclude(u => u.TimeSlots)
                    .Where(d => d.User.TimeSlots.Any(ts => ts.Date == Date));
            }

            return query.Select(d => new DoctorCard
            {
                DoctorId = d.User.Id,
                Slug = d.Slug,
                DoctorName = d.User.FullName,
                ImageUrl = d.User.Avatar,
                ShortDescription = d.ShortDescription,
                PricePerHour = d.PricePerHour,
                ClinicSlug = d.Clinic.Slug,
                ClinicName = d.Clinic.Name,
                ClinicAddress = d.Clinic.Address,
                ClinicCity = d.Clinic.City,
                AvailableDates = d.User.TimeSlots.Where(ts => !ts.IsBooked && ts.Date >= DateOnly.FromDateTime(DateTime.Now))
                    .Select(ts => ts.Date)
                    .Distinct()
                    .ToList()
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

        public async Task<DoctorDetailDto> GetDoctorDetail(string Slug)
        {
            var doctor = await _context.DoctorProfiles
                .Where(d => d.Slug == Slug)
                .Select(d => new DoctorDetailDto
                {
                    DoctorId = d.User.Id,
                    Slug = d.Slug,
                    DoctorName = d.User.FullName,
                    SpecialtySlug = d.Specialty != null ? d.Specialty.Slug : string.Empty,
                    SpecialtyName = d.Specialty != null ? d.Specialty.Name : string.Empty,
                    ImageUrl = d.User.Avatar ?? string.Empty,
                    ShortDescription = d.ShortDescription ?? string.Empty,
                    Biography = d.Biography ?? string.Empty,
                    PricePerHour = d.PricePerHour,
                    ClinicSlug = d.Clinic != null ? d.Clinic.Slug : string.Empty,
                    ClinicName = d.Clinic != null ? d.Clinic.Name : string.Empty,
                    ClinicAddress = d.Clinic != null ? d.Clinic.Address : string.Empty,
                    ClinicCity = d.Clinic != null ? d.Clinic.City : string.Empty,
                    AvailableDates = d.User.TimeSlots
                        .Where(ts => !ts.IsBooked && ts.Date >= DateOnly.FromDateTime(DateTime.Now))
                        .Select(ts => ts.Date)
                        .Distinct()
                        .ToList()
                })
                .FirstOrDefaultAsync()
                ?? throw new NotFoundException("Không tìm thấy thông tin bác sĩ");

            return doctor;
        }

        public async Task<SlotAndDoctorDto> GetSlotDetail(int SlotId)
        {
            return await _context.TimeSlots
                .Where(s => s.Id == SlotId)
                .Select(s => new SlotAndDoctorDto
                {
                    SlotId = s.Id,
                    IsBooked = s.IsBooked,
                    DoctorName = s.Doctor.FullName,
                    ImageUrl = s.Doctor.Avatar ?? string.Empty,
                    DoctorSlug = s.Doctor.DoctorProfile != null ? s.Doctor.DoctorProfile.Slug : "",
                    PricePerHour = s.Doctor.DoctorProfile != null ? s.Doctor.DoctorProfile.PricePerHour : 0,
                    Date = s.Date,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    ClinicAddress = s.Doctor.DoctorProfile.Clinic.Address + ", " + s.Doctor.DoctorProfile.Clinic.City,
                    ClinicName = s.Doctor.DoctorProfile.Clinic.Name,
                    SpecialtySlug = s.Doctor.DoctorProfile.Specialty != null ? s.Doctor.DoctorProfile.Specialty.Slug : string.Empty,
                    SpecialtyName = s.Doctor.DoctorProfile.Specialty != null ? s.Doctor.DoctorProfile.Specialty.Name : string.Empty
                })
                .FirstOrDefaultAsync()
                ?? throw new NotFoundException("Không tìm thấy thông tin lịch khám");
        }
    }
}
