using backend.Models.Enums;

namespace backend.Models.DTOs.User
{
    public class AdminCreateUserDto
    {
        public string Name { get; set; } = null!;
        public string? Phone { get; set; }
        public string Email { get; set; } = null!;
        public string? Avatar { get; set; }
        public UserRoleEnum? Role { get; set; } = null!;

    }
}
