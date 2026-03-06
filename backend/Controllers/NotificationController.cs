namespace backend.Controllers;

using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class NotificationController : ControllerBase
{
    private readonly IAppointmentNotifier _notifier;

    public NotificationController(IAppointmentNotifier notifier)
    {
        _notifier = notifier;
    }

    [HttpGet("stream/{doctorId}")]
    public async Task StreamNotifications(Guid doctorId, CancellationToken ct)
    {
        Response.Headers["Content-Type"] = "text/event-stream";
        Response.Headers["Cache-Control"] = "no-cache";
        Response.Headers["X-Accel-Buffering"] = "no";

        _notifier.Register(doctorId, Response);

        try
        {
            await Task.Delay(Timeout.Infinite, ct); // hold connection open
        }
        catch (TaskCanceledException) { } // client disconnected — that's fine
        finally
        {
            _notifier.Unregister(doctorId); // always clean up
        }
    }
}