using backend.Models.DTOs.Booking;

public interface IAppointmentNotifier
{
    void Register(Guid doctorId, HttpResponse response);
    void Unregister(Guid doctorId);
    Task NotifyDoctor(Guid doctorId, AppointmentItemDto notification);

    void RegisterUser(Guid userId, HttpResponse response);
    void UnregisterUser(Guid userId);
    Task NotifyUser(Guid userId, Guid AppointmentId);
}