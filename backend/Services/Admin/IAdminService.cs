using backend.Models.DTOs.User;

namespace backend.Services.Admin
{
    public interface IAdminService
    {
        Task AdminCreateUser(AdminCreateUserDto dto);

        Task<List<UserResponseDto>> GetAllUsers();
    }
}
