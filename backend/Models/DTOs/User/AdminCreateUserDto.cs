using backend.Models.Enums;

namespace backend.Models.DTOs.User
{
    public class AdminCreateUserDto
    {
        public string FullName { get; set; } = null!;
        public string? Phone { get; set; }
        public string Email { get; set; } = null!;
        public UserRoleEnum? Role { get; set; } = null!;
    }
}
