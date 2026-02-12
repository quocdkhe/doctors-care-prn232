using backend.Services.Account;
using backend.Services.Admin;
using backend.Services.Authentication;
using backend.Services.FileUpload;
using backend.Services.Implementation;
using backend.Services.Patient;
using backend.Services.Doctor;

namespace backend.Configurations
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddProjectServices(this IServiceCollection services)
        {
            // Register your project-specific services here
            services.AddScoped<IFileService, FileService>();
            services.AddScoped<IAdminService, AdminService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IPatientService, PatientService>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<ISpecialtyService, SpecialtyService>();
            services.AddScoped<IClinicService, ClinicService>();
            services.AddScoped<IDoctorProfileService, DoctorProfileService>();
            return services;
        }
    }
}
