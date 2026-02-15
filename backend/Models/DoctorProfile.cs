namespace backend.Models
{
    public class DoctorProfile
    {
        public Guid Id { get; set; }
        public string Slug { get; set; } = null!;
        public string? Biography { get; set; }
        public Guid? SpecialtyId { get; set; }
        public Specialty? Specialty { get; set; }
        public Guid? ClinicId { get; set; }
        public Clinic? Clinic { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
        public int PricePerHour { get; set; } = 0;
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }
    }
}
