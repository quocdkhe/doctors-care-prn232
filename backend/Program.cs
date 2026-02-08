
using backend.Configurations;
using backend.Exceptions;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddDbContext<DoctorsCareContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("MyCnn")));

            builder.Services.AddControllers(options =>
            {
                options.Filters.Add<GlobalExceptionFilter>();
            });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddStorageConfig(builder.Configuration); // Storage configuration  
            builder.Services.AddHttpClient(); // HttpClient for external API calls

            // Add services to the container.
            builder.Services.AddProjectServices();
            builder.Services.AddJwtConfig(builder.Configuration); // JWT and CORS configuration
            builder.Services.AddCorsConfig(builder.Configuration); // CORS configuration
            

            var app = builder.Build();
            // Use cors configuration
            app.UseCors("CorsPolicy");
            // Run migration
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var context = services.GetRequiredService<DoctorsCareContext>();
                context.Database.Migrate();
            }


            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
