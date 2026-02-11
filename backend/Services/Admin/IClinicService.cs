using System;
using backend.Models;

namespace backend.Services.Admin;

public interface IClinicService
{
    public Task<List<Clinic>> GetAllClinics();
    public Task<Clinic?> GetClinicById(Guid id);
    public Task<Clinic> CreateClinic(Clinic clinic);
    public Task<Clinic?> UpdateClinic(Guid id, Clinic clinic);
    public Task<bool> DeleteClinic(Guid id);
}
