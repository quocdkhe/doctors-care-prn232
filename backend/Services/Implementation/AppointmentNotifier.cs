using System.Text.Json;
using backend.Models.DTOs.Booking;

public class AppointmentNotifier : IAppointmentNotifier
{
    private readonly Dictionary<Guid, HttpResponse> _doctorConnections = new();

    public void Register(Guid doctorId, HttpResponse response)
    {
        lock (_doctorConnections)
        {
            _doctorConnections[doctorId] = response;
        }
    }

    public void Unregister(Guid doctorId)
    {
        lock (_doctorConnections)
        {
            _doctorConnections.Remove(doctorId);
        }
    }

    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public async Task NotifyDoctor(Guid doctorId, AppointmentItemDto notification)
    {
        HttpResponse? response;
        lock (_doctorConnections)
        {
            _doctorConnections.TryGetValue(doctorId, out response);
        }

        if (response != null)
        {
            var json = JsonSerializer.Serialize(notification, _jsonOptions); // ✅ camelCase
            await response.WriteAsync($"data: {json}\n\n");
            await response.Body.FlushAsync();
        }
    }

}