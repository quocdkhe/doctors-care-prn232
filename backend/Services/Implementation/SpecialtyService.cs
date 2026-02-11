namespace backend.Services.Implementation;

using backend.Models;
using System.Threading.Tasks;
using backend.Services.Admin;
using Microsoft.EntityFrameworkCore;
using backend.Exceptions;
using backend.Utils;

public class SpecialtyService : ISpecialtyService
{
    private readonly DoctorsCareContext _context;

    public SpecialtyService(DoctorsCareContext context)
    {
        _context = context;
    }

    public async Task<Specialty> CreateSpecialty(Specialty specialty)
    {
        string baseSlug = VietnameseSlugGenerator.ToSlug(specialty.Name);
        var existingSlugs = await _context.Specialties
            .Where(s => s.Slug.StartsWith(baseSlug))
            .Select(s => s.Slug)
            .ToListAsync();

        specialty.Slug = VietnameseSlugGenerator.GenerateUniqueSlug(specialty.Name, existingSlugs.ToArray());
        _context.Specialties.Add(specialty);
        await _context.SaveChangesAsync();
        return specialty;
    }

    public async Task<bool> DeleteSpecialty(Guid id)
    {
        var specialty = await _context.Specialties.FindAsync(id);
        if (specialty == null)
        {
            throw new NotFoundException("Chuyên khoa không tồn tại");
        }
        try
        {
            _context.Specialties.Remove(specialty);

        }
        catch (DbUpdateException)
        {
            throw new BadRequestException("Không thể xóa chuyên khoa này vì có liên quan đến dữ liệu khác.");
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<Specialty>> GetAllSpecialties()
    {
        return await _context.Specialties.ToListAsync();
    }

    public async Task<Specialty?> GetSpecialtyById(Guid id)
    {
        return await _context.Specialties.FindAsync(id);
    }

    public async Task<Specialty?> UpdateSpecialty(Guid id, Specialty specialty)
    {
        var existingSpecialty = await _context.Specialties.FindAsync(id);
        if (existingSpecialty == null)
        {
            throw new NotFoundException("Chuyên khoa không tồn tại");
        }
        string baseSlug = VietnameseSlugGenerator.ToSlug(specialty.Name);
        var existingSlugs = await _context.Specialties
            .Where(s => s.Slug.StartsWith(baseSlug) && s.Id != id)
            .Select(s => s.Slug)
            .ToListAsync();

        existingSpecialty.Slug = VietnameseSlugGenerator.GenerateUniqueSlug(specialty.Name, existingSlugs.ToArray());
        existingSpecialty.Name = specialty.Name;
        existingSpecialty.Description = specialty.Description;
        existingSpecialty.ImageUrl = specialty.ImageUrl;

        await _context.SaveChangesAsync();
        return existingSpecialty;
    }
}