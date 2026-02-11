using System;
using backend.Exceptions;
using backend.Models;
using backend.Services.Admin;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementation;

public class ClinicService : IClinicService
{
    private readonly DoctorsCareContext _context;
    public ClinicService(DoctorsCareContext context)
    {
        _context = context;
    }

    public async Task<Clinic> CreateClinic(Clinic clinic)
    {
        string baseSlug = VietnameseSlugGenerator.ToSlug(clinic.Name);
        var existingSlugs = await _context.Clinics
            .Where(s => s.Slug.StartsWith(baseSlug))
            .Select(s => s.Slug)
            .ToListAsync();

        clinic.Slug = VietnameseSlugGenerator.GenerateUniqueSlug(clinic.Name, existingSlugs.ToArray());
        _context.Clinics.Add(clinic);
        await _context.SaveChangesAsync();
        return clinic;
    }

    public async Task<bool> DeleteClinic(Guid id)
    {
        var clinic = await _context.Clinics.FindAsync(id);
        if (clinic == null)
        {
            throw new NotFoundException("Phòng khám không tồn tại");
        }
        try
        {
            _context.Clinics.Remove(clinic);

        }
        catch (DbUpdateException)
        {
            throw new BadRequestException("Không thể xóa phòng khám này vì có liên quan đến dữ liệu khác.");
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<Clinic>> GetAllClinics()
    {
        return await _context.Clinics.ToListAsync();
    }

    public async Task<Clinic?> GetClinicById(Guid id)
    {
        return await _context.Clinics.FindAsync(id);
    }

    public async Task<Clinic?> UpdateClinic(Guid id, Clinic clinic)
    {
        var existingClinic = await _context.Clinics.FindAsync(id);
        if (existingClinic == null)
        {
            throw new NotFoundException("Phòng khám không tồn tại");
        }
        string baseSlug = VietnameseSlugGenerator.ToSlug(clinic.Name);
        var existingSlugs = await _context.Clinics
            .Where(s => s.Slug.StartsWith(baseSlug) && s.Id != id)
            .Select(s => s.Slug)
            .ToListAsync();

        existingClinic.Slug = VietnameseSlugGenerator.GenerateUniqueSlug(clinic.Name, existingSlugs.ToArray());
        existingClinic.Name = clinic.Name;
        existingClinic.Description = clinic.Description;
        existingClinic.ImageUrl = clinic.ImageUrl;
        existingClinic.City = clinic.City;
        existingClinic.Address = clinic.Address;

        await _context.SaveChangesAsync();
        return existingClinic;
    }
}
