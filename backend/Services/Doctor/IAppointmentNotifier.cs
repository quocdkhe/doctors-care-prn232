using backend.Models.DTOs.Booking;

public interface IAppointmentNotifier
{
    void Register(Guid doctorId, HttpResponse response);
    void Unregister(Guid doctorId);
    Task NotifyDoctor(Guid doctorId, AppointmentItemDto notification);
}