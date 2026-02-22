using System;

namespace backend.Models.DTOs.Clinic;

public class ClinicDetailDto : ClinicDto
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = null!;
}
