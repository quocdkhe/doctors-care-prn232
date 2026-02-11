using backend.Models;

namespace backend.Services.Admin
{
    public interface ISpecialtyService
    {
        public Task<List<Specialty>> GetAllSpecialties();
        public Task<Specialty?> GetSpecialtyById(Guid id);
        public Task<Specialty> CreateSpecialty(Specialty specialty);
        public Task<Specialty?> UpdateSpecialty(Guid id, Specialty specialty);
        public Task<bool> DeleteSpecialty(Guid id);
    }
}