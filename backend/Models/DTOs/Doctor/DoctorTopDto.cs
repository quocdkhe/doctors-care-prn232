namespace backend.Models.DTOs.Doctor
{
    public class DoctorTopDto
    {
        public string DoctorSlug { get; set; } = null!;
        public string DoctorName { get; set; } = null!;
        public string DoctorAvatar { get; set; } = null!;
        public string SpecialtyName { get; set; } = null!;
        public string SpecialtySlug { get; set; } = null!;
        public int AppoinmentCount { get; set; }
    }
}
