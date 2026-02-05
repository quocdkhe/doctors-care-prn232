using backend.Services.FileUpload;
using backend.Services.Implementation;

namespace backend.Configurations
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddProjectServices(this IServiceCollection services)
        {
            // Register your project-specific services here
            // e.g., services.AddScoped<IYourService, YourServiceImplementation>();
            services.AddScoped<IFileService, FileService>();
            return services;
        }
    }
}
