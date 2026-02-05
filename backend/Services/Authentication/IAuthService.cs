using backend.Models;
using System.Security.Claims;

namespace backend.Services.Authentication
{
    public interface IAuthService
    {
        public string GenerateAccessToken(User user);

        public ClaimsPrincipal? ValidateAccessToken(string token);

    }
}
