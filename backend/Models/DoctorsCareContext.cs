using backend.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public partial class DoctorsCareContext : DbContext
    {
        public DoctorsCareContext()
        {
        }

        public DoctorsCareContext(DbContextOptions<DoctorsCareContext> options)
            : base(options)
        {
        }
        public virtual DbSet<RefreshToken> RefreshTokens { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.ToTable("refresh_tokens");

                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.UserId)
                      .HasColumnName("user_id");

                entity.Property(e => e.Token)
                      .HasColumnName("token")
                      .IsRequired()
                      .HasMaxLength(512);

                entity.Property(e => e.ExpiresAt)
                      .HasColumnName("expires_at");

                entity.Property(e => e.CreatedAt)
                      .HasDefaultValueSql("CURRENT_TIMESTAMP")
                      .HasColumnName("created_at");

                // Indexes
                entity.HasIndex(e => e.Token)
                      .HasDatabaseName("idx_refresh_tokens_token");

                entity.HasIndex(e => e.UserId)
                      .HasDatabaseName("idx_refresh_tokens_user_id");

                // Foreign key -> Users(Id)
                entity.HasOne(d => d.User)
                      .WithMany(p => p.RefreshTokens)
                      .HasForeignKey(d => d.UserId)
                      .OnDelete(DeleteBehavior.Cascade)
                      .HasConstraintName("fk_refresh_tokens_users_user_id");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.FullName)
                      .HasColumnName("full_name")
                      .IsRequired()
                      .HasMaxLength(255);

                entity.Property(e => e.Phone)
                      .HasColumnName("phone")
                      .HasMaxLength(20);

                entity.Property(e => e.Email)
                      .HasColumnName("email")
                      .IsRequired()
                      .HasMaxLength(255);

                entity.Property(e => e.Password)
                      .HasColumnName("password")
                      .IsRequired()
                      .HasMaxLength(255);

                entity.Property(e => e.Avatar)
                      .HasColumnName("avatar");

                entity.Property(e => e.Role)
                      .HasConversion<string>()
                      .HasDefaultValue(UserRoleEnum.Patient)
                      .HasColumnName("role");

                entity.Property(e => e.CreatedAt)
                      .HasDefaultValueSql("CURRENT_TIMESTAMP")
                      .HasColumnName("created_at");

                entity.Property(e => e.UpdatedAt)
                      .HasDefaultValueSql("CURRENT_TIMESTAMP")
                      .HasColumnName("updated_at");

                // Indexes
                entity.HasIndex(e => e.Email)
                      .HasDatabaseName("idx_users_email")
                      .IsUnique();

                // Navigation
                entity.HasMany(e => e.RefreshTokens)
                      .WithOne(rt => rt.User)
                      .HasForeignKey(rt => rt.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }

    }
}
