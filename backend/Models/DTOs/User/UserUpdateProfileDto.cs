namespace backend.Models.DTOs.User
{
    public class UserUpdateProfileDto
    {
        public string FullName { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string? Password { get; set; }
        public string? Avatar { get; set; }
    }
}
