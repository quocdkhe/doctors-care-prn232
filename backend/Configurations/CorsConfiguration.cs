namespace backend.Configurations
{
    public static class CorsConfiguration
    {
        public static IServiceCollection AddCorsConfig(this IServiceCollection services, IConfiguration configuration)
        {
            // Cors configuration
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", policy =>
                {
                    policy.SetIsOriginAllowed(origin => 
                    {
                        if (string.IsNullOrWhiteSpace(origin)) return false;

                        var host = new Uri(origin).Host;
                        return host == "localhost" || 
                            host == "100.100.56.64" ||
                            host == "doctors-care.quocdk.id.vn" || 
                            host.EndsWith(".vercel.app");
                    })
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials(); // Required for your JWT cookies
                });
            });
            return services;
        }
    }
}
