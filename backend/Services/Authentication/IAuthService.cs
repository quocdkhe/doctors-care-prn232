using backend.Models;

namespace backend.Services.Authentication
{
    public interface IAuthService
    {
        Task<User?> GetUserByEmail(string Email);

        Task<User?> GetUserById(Guid userId);
    }
}
