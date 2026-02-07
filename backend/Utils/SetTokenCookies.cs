namespace backend.Utils
{
    public static class SetTokenCookies
    {

        private static readonly CookieOptions ACCESS_TOKEN_OPTION = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddMinutes(15)
        };

        private static readonly CookieOptions REFRESH_TOKEN_OPTION = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(7)
        };

        public static void SetTokenCookiesToResponse(HttpResponse response, string accessToken, string refreshToken)
        {
            response.Cookies.Append("access_token", accessToken, ACCESS_TOKEN_OPTION);
            response.Cookies.Append("refresh_token", refreshToken, REFRESH_TOKEN_OPTION);
        }
    }
}
