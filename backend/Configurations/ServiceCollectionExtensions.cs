using backend.Services.Admin;
using backend.Services.FileUpload;
using backend.Services.Implementation;

namespace backend.Configurations
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddProjectServices(this IServiceCollection services)
        {
            // Register your project-specific services here
            services.AddScoped<IFileService, FileService>();
            services.AddScoped<IAdminService, AdminService>();
            return services;
        }
    }
}
