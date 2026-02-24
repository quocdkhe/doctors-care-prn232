using backend.Exceptions;
using backend.Models;
using backend.Models.DTOs.Booking;
using backend.Models.DTOs.Clinic;
using backend.Models.DTOs.Doctor;
using backend.Models.Enums;
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
                    .Where(d => d.User.TimeSlots.Any(ts => ts.Date == Date && !ts.IsBooked));
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
                SpecialtySlug = d.Specialty.Slug,
                ClinicName = d.Clinic.Name,
                ClinicAddress = d.Clinic.Address,
                ClinicCity = d.Clinic.City,
                AvailableDates = d.User.TimeSlots.Where(ts => !ts.IsBooked && ts.Date >= DateOnly.FromDateTime(DateTime.Now))
                    .Select(ts => ts.Date)
                    .Distinct()
                    .ToList()
            }).ToList();

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

        public async Task<SpecialtyDetailDto> GetSpecialtyDetail(string SpecialtySlug)
        {
            return await _context.Specialties
                .Where(s => s.Slug == SpecialtySlug)
                .Select(s => new SpecialtyDetailDto
                {
                    SpeicaltySlug = s.Slug,
                    SpecialtyName = s.Name,
                    SpecialtyDescription = s.Description,
                    SpeialtyImage = s.ImageUrl
                })
                .FirstOrDefaultAsync()
                ?? throw new NotFoundException("Không tìm thấy thông tin chuyên khoa");
        }

        public async Task<ClinicDetailDto> GetClinicDetail(string ClinicSlug)
        {
            return await _context.Clinics
                .Where(c => c.Slug == ClinicSlug)
                .Select(c => new ClinicDetailDto
                {
                    Id = c.Id,
                    Slug = c.Slug,
                    Name = c.Name,
                    Description = c.Description,
                    ImageUrl = c.ImageUrl ?? string.Empty,
                    City = c.City,
                    Address = c.Address
                })
                .FirstOrDefaultAsync()
                ?? throw new NotFoundException("Không tìm thấy thông tin phòng khám");
        }

        public async Task<List<PatientAppointmentDto>> GetAllAppointmentsForPatient(Guid PatientId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.BookByUserId == PatientId)
                .Select(a => new PatientAppointmentDto
                {
                    DoctorName = a.TimeSlot.Doctor.FullName,
                    DoctorAvatar = a.TimeSlot.Doctor.Avatar,
                    ClinicName = a.TimeSlot.Doctor.DoctorProfile.Clinic.Name,
                    ClinicAddress = a.TimeSlot.Doctor.DoctorProfile.Clinic.Address + ", " + a.TimeSlot.Doctor.DoctorProfile.Clinic.City,
                    StartTime = a.TimeSlot.StartTime,
                    EndTime = a.TimeSlot.EndTime,
                    Date = a.TimeSlot.Date,
                    Status = a.Status,
                    Reason = a.Reason ?? string.Empty,
                    MedicalRecordFileUrl = a.MedicalRecordFileUrl,
                    PatientName = a.PatientName,
                    PatientGender = a.PatientGender,
                    PatientPhone = a.PatientPhone,
                    PatientDateOfBirth = a.PatientDateOfBirth,
                    PatientAddress = a.PatientAddress
                })
                .OrderByDescending(a => a.Date)
                .ToListAsync();

            return appointments;
        }

        public async Task<List<DoctorTopDto>> GetTopDoctors()
        {
            var topDoctors = await _context.DoctorProfiles
                .Include(d => d.User)
                .Include(d => d.Specialty)
                .Include(d => d.User.TimeSlots)
                .AsQueryable()
                .Select(d => new
                {
                    DoctorProfile = d,
                    AppointmentCount = _context.Appointments
                        .Count(a => a.TimeSlot.DoctorId == d.UserId && a.Status == AppointmentStatusEnum.Completed)
                })
                .OrderByDescending(x => x.AppointmentCount)
                .Take(10)
                .Select(x => new DoctorTopDto
                {
                    DoctorSlug = x.DoctorProfile.Slug,
                    DoctorName = x.DoctorProfile.User.FullName,
                    DoctorAvatar = x.DoctorProfile.User.Avatar ?? string.Empty,
                    SpecialtyName = x.DoctorProfile.Specialty != null ? x.DoctorProfile.Specialty.Name : string.Empty,
                    SpecialtySlug = x.DoctorProfile.Specialty != null ? x.DoctorProfile.Specialty.Slug : string.Empty,
                    AppoinmentCount = x.AppointmentCount
                })
                .ToListAsync();

            return topDoctors;
        }
    }
}
