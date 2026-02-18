namespace backend.Models.DTOs.Doctor
{
    public class SpecialtyAndDoctors
    {
        public string SpeicaltySlug { get; set; } = null!;
        public string SpecialtyName { get; set; } = null!;
        public string SpecialtyDescription { get; set; } = null!;
        public string? SpeialtyImage { get; set; }
        public List<DoctorCard> Doctors { get; set; } = new List<DoctorCard>();
    }
}
