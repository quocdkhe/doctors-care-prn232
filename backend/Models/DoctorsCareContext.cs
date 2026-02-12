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
		public virtual DbSet<Specialty> Specialties { get; set; }
		public virtual DbSet<Clinic> Clinics { get; set; }
		public virtual DbSet<DoctorProfile> DoctorProfiles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<RefreshToken>(entity =>
			{
				entity.ToTable("refresh_tokens");

				entity.HasKey(e => e.Id);
				entity.Property(e => e.Id)
					  .HasColumnName("id")
					  .UseIdentityColumn(1, 1);

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
				entity.Property(e => e.Id)
					  .HasColumnName("id")
					  .HasDefaultValueSql("NEWID()");

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

			modelBuilder.Entity<Specialty>(entity =>
			{
				entity.ToTable("specialties");

				entity.HasKey(e => e.Id);
				entity.Property(e => e.Id)
					  .HasColumnName("id")
					  .HasDefaultValueSql("NEWID()");

				entity.Property(e => e.Name)
					  .HasColumnName("name")
					  .IsRequired()
					  .HasMaxLength(255);

				entity.Property(e => e.Slug)
					  .HasColumnName("slug")
					  .IsRequired()
					  .HasMaxLength(255);

				entity.Property(e => e.Description)
					  .HasColumnName("description")
					  .IsRequired();

				entity.Property(e => e.ImageUrl)
					  .HasColumnName("image_url");

				entity.Property(e => e.CreatedAt)
					  .HasDefaultValueSql("CURRENT_TIMESTAMP")
					  .HasColumnName("created_at");

				entity.Property(e => e.UpdatedAt)
					  .HasDefaultValueSql("CURRENT_TIMESTAMP")
					  .HasColumnName("updated_at");

				// Indexes
				entity.HasIndex(e => e.Slug)
					  .HasDatabaseName("idx_specialties_slug")
					  .IsUnique();
			});
			modelBuilder.Entity<Clinic>(entity =>
			{
				entity.ToTable("clinics");

				entity.HasKey(e => e.Id);
				entity.Property(e => e.Id)
					.HasColumnName("id")
					.HasDefaultValueSql("NEWID()");

				entity.Property(e => e.Name)
					.HasColumnName("name")
					.IsRequired()
					.HasMaxLength(255);

				entity.Property(e => e.Slug)
					.HasColumnName("slug")
					.IsRequired()
					.HasMaxLength(255);

				entity.Property(e => e.Description)
					.HasColumnName("description")
					.IsRequired();

				entity.Property(e => e.ImageUrl)
					.HasColumnName("image_url");

				entity.Property(e => e.City)
					.HasColumnName("city")
					.IsRequired()
					.HasMaxLength(100);

				entity.Property(e => e.Address)
					.HasColumnName("address")
					.IsRequired()
					.HasMaxLength(255);

				entity.Property(e => e.CreatedAt)
					.HasDefaultValueSql("CURRENT_TIMESTAMP")
					.HasColumnName("created_at");

				entity.Property(e => e.UpdatedAt)
					.HasDefaultValueSql("CURRENT_TIMESTAMP")
					.HasColumnName("updated_at");

				// Indexes
				entity.HasIndex(e => e.Slug)
					.HasDatabaseName("idx_clinics_slug")
					.IsUnique();
			});

			modelBuilder.Entity<DoctorProfile>(entity =>
			{
				entity.ToTable("doctor_profiles");

				entity.HasKey(e => e.Id);
				entity.Property(e => e.Id)
					.HasColumnName("id")
					.HasDefaultValueSql("NEWID()");

				entity.Property(e => e.Biography)
					.HasColumnName("biography")
					.IsRequired(false);  // NULL allowed

				entity.Property(e => e.SpecialtyId)
					.HasColumnName("specialty_id")
					.IsRequired(false);  // NULL allowed

				entity.Property(e => e.ClinicId)
					.HasColumnName("clinic_id")
					.IsRequired(false);  // NULL allowed

				entity.Property(e => e.UserId)
					.HasColumnName("user_id")
					.IsRequired();  // NOT NULL

				entity.Property(e => e.CreatedAt)
					.HasDefaultValueSql("CURRENT_TIMESTAMP")
					.HasColumnName("created_at")
					.IsRequired();  // NOT NULL

				entity.Property(e => e.UpdatedAt)
					.HasDefaultValueSql("CURRENT_TIMESTAMP")
					.HasColumnName("updated_at")
					.IsRequired();  // NOT NULL

				// Indexes
				entity.HasIndex(e => e.SpecialtyId)
					.HasDatabaseName("idx_doctor_profiles_specialty_id");

				entity.HasIndex(e => e.ClinicId)
					.HasDatabaseName("idx_doctor_profiles_clinic_id");

				entity.HasIndex(e => e.UserId)
					.HasDatabaseName("idx_doctor_profiles_user_id")
					.IsUnique();

				// Foreign keys
				entity.HasOne(d => d.Specialty)
					.WithMany()
					.HasForeignKey(d => d.SpecialtyId)
					.OnDelete(DeleteBehavior.SetNull)
					.HasConstraintName("fk_doctor_profiles_specialties_specialty_id");

				entity.HasOne(d => d.Clinic)
					.WithMany()
					.HasForeignKey(d => d.ClinicId)
					.OnDelete(DeleteBehavior.SetNull)
					.HasConstraintName("fk_doctor_profiles_clinics_clinic_id");

				entity.HasOne(d => d.User)
					.WithMany()
					.HasForeignKey(d => d.UserId)
					.OnDelete(DeleteBehavior.Cascade)
					.HasConstraintName("fk_doctor_profiles_users_user_id");
			});
		}



	}
}
