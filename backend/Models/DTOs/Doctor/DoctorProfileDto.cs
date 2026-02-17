using backend.Models.DTOs.User;

namespace backend.Models.DTOs.Doctor
{
    public class CurrentDoctorProfileDto
    {
        public Guid Id { get; set; }
        public UserResponseDto User { get; set; } = null!;
        public string? Biography { get; set; }
        public string? ShortDescription { get; set; }
        public int PricePerHour { get; set; } = 0;
        public Guid? SpecialtyId { get; set; }
        public Guid? ClinicId { get; set; }
    }
}
