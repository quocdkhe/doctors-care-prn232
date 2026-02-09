using backend.Models;
using backend.Models.DTOs.User;

namespace backend.Services.Account
{
    public interface IAccountService
    {
        public Task UpdateProfile(Guid userId, UserUpdateProfileDto dto);

        public Task<User> Register(RegisterDto dto);
    }
}
