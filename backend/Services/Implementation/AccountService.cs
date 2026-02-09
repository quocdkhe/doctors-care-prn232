using backend.Exceptions;
using backend.Models;
using backend.Models.DTOs.User;
using backend.Models.Enums;
using backend.Services.Account;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementation
{
    public class AccountService : IAccountService
    {
        private readonly DoctorsCareContext _context;

        public AccountService(DoctorsCareContext context)
        {
            _context = context;
        }

        public async Task UpdateProfile(Guid userId, UserUpdateProfileDto dto)
        {
            var currentUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if(currentUser == null)
            {
                throw new NotFoundException("Không tìm thấy người dùng");
            }

            currentUser.FullName = dto.FullName;
            currentUser.Phone = dto.Phone;
            if(!string.IsNullOrEmpty(dto.Password))
            {
                currentUser.Password = PasswordHashing.HashPassword(dto.Password);
            }
            if(!string.IsNullOrEmpty(dto.Avatar))
            {
                currentUser.Avatar = dto.Avatar;
            }

            _context.Users.Update(currentUser);
            await _context.SaveChangesAsync();
        }


        public async Task<User> Register(RegisterDto dto)
        {
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            var userEntity = await _context.Users.AddAsync(new User
            {
                FullName = dto.FullName,
                Phone = dto.Phone,
                Email = dto.Email,
                Password = hashedPassword,
                Role = UserRoleEnum.Patient,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
            return userEntity.Entity;
        }
    }
}
