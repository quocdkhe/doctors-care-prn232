using backend.Models.DTOs.Statistics;
using backend.Models.DTOs.User;

namespace backend.Services.Admin
{
    public interface IAdminService
    {
        Task AdminCreateUser(AdminCreateUserDto dto);
        Task<StatisticsDto> GetStatistics();
        Task<List<UserResponseDto>> GetAllUsers();
    }
}
