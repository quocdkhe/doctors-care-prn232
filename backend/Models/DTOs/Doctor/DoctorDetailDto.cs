using System;

namespace backend.Models.DTOs.Doctor;

public class DoctorDetailDto
{
    public Guid DoctorId { get; set; }
    public string Slug { get; set; } = null!;
    public string DoctorName { get; set; } = null!;
    public string SpecialtySlug { get; set; } = null!;
    public string ImageUrl { get; set; } = null!;
    public string ShortDescription { get; set; } = null!;
    public string Biography { get; set; } = null!;
    public int PricePerHour { get; set; } = 0;
    public string ClinicSlug { get; set; } = null!;
    public string ClinicName { get; set; } = null!;
    public string ClinicAddress { get; set; } = null!;
    public string ClinicCity { get; set; } = null!;
    public List<DateOnly> AvailableDates { get; set; } = new List<DateOnly>();
}
