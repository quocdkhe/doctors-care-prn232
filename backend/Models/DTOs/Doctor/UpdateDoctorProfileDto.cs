namespace backend.Models.DTOs.Doctor
{
    public class UpdateDoctorProfileDto
    {
        public string? Biography { get; set; }
        public string? ShortDescription { get; set; }
        public Guid? SpecialtyId { get; set; }
        public Guid? ClinicId { get; set; }
        public int PricePerHour { get; set; } = 0;
        public string? ImageUrl { get; set; }
        public string? FullName { get; set; }
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public string? Password { get; set; }
    }
}
