namespace backend.Models.DTOs.Doctor
{
    public class SpecialtyDetailDto
    {
        public string SpeicaltySlug { get; set; } = null!;
        public string SpecialtyName { get; set; } = null!;
        public string SpecialtyDescription { get; set; } = null!;
        public string? SpeialtyImage { get; set; }
    }
}
