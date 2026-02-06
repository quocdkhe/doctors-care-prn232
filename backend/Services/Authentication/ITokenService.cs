using backend.Models;
using System.Security.Claims;

namespace backend.Services.Authentication
{
    public interface ITokenService
    {
        public string GenerateAccessToken(User user);

        public ClaimsPrincipal? ValidateAccessToken(string token);

        public string GenerateRefreshToken();

        public Task SaveRefreshToken(Guid userId, string refreshToken);

        public Task<RefreshToken?> GetValidRefreshToken(string refreshToken);

        Task RevokeToken(int tokenId);

    }
}
