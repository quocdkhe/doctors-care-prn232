using backend.Models;
using backend.Services.Authentication;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementation
{
    public class AuthService : IAuthService
    {
        private readonly DoctorsCareContext _context;
        public AuthService(DoctorsCareContext context)
        {
            _context = context;
        }
        public async Task<User?> GetUserByEmail(string Email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == Email);
        }

        public async Task<User?> GetUserById(Guid userId)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        }
    }
}
