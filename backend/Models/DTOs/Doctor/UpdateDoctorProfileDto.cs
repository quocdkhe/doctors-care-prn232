namespace backend.Models.DTOs.Doctor
{
    public class UpdateDoctorProfileDto
    {
        public string? biography { get; set; }
        public Guid? specialtyId { get; set; }
        public Guid? clinicId { get; set; }
        public int PricePerHour { get; set; } = 0;
        public string? ImageUrl { get; set; }
        public string? FullName { get; set; }
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public string? Password { get; set; }
    }
}
