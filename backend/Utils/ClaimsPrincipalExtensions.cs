using backend.Exceptions;
using System.Security.Claims;

namespace backend.Utils;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        var value = user.FindFirstValue(ClaimTypes.NameIdentifier);

        if (value == null || !Guid.TryParse(value, out var userId))
        {
            throw new UnauthorizedException("Invalid user id claim");
        }

        return userId;
    }
}
