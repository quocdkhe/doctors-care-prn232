using System;

namespace backend.Models.DTOs.Clinic;

public class ClinicDto
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string ImageUrl { get; set; } = null!;
    public string City { get; set; } = null!;
    public string Address { get; set; } = null!;
}
