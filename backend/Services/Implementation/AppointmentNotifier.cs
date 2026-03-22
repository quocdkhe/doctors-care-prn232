using backend.Models.DTOs.Booking;
using System.Text.Json;

public class AppointmentNotifier : IAppointmentNotifier
{
    private readonly Dictionary<Guid, HttpResponse> _doctorConnections = new();
    private readonly Dictionary<Guid, HttpResponse> _userConnections = new();

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

    public void RegisterUser(Guid userId, HttpResponse response)
    {
        lock (_userConnections)
        {
            _userConnections[userId] = response;
        }
    }

    public void UnregisterUser(Guid userId)
    {
        lock (_userConnections)
        {
            _userConnections.Remove(userId);
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
            var json = JsonSerializer.Serialize(notification, _jsonOptions);
            await response.WriteAsync($"data: {json}\n\n");
            await response.Body.FlushAsync();
        }
    }

    public async Task NotifyUser(Guid userId, Guid appointmentId)
    {
        HttpResponse? response;
        lock (_userConnections)
        {
            _userConnections.TryGetValue(userId, out response);
        }

        if (response != null)
        {
            var json = JsonSerializer.Serialize(appointmentId, _jsonOptions);
            await response.WriteAsync($"data: {json}\n\n");
            await response.Body.FlushAsync();
        }
    }

}
