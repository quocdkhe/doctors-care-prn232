using backend.Models.Enums;

namespace backend.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = null!;
        public string? Phone { get; set; }
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? Avatar { get; set; }
        public UserRoleEnum Role { get; set; } = UserRoleEnum.Patient;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
        public virtual ICollection<TimeSlot> TimeSlots { get; set; } = new List<TimeSlot>();
        public DoctorProfile? DoctorProfile { get; set; }
    }
}
