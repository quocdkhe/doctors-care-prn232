namespace backend.Models.Enums;

using System.Text.Json.Serialization;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum AppointmentStatusEnum
{
    Scheduled,
    Completed,
    Cancelled
}
