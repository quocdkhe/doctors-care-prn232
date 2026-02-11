using System;

namespace backend.Utils;

using System.Text.RegularExpressions;

public static class VietnameseSlugGenerator
{
    /// <summary>
    /// Converts Vietnamese text to URL-friendly slug
    /// </summary>
    /// <param name="text">Text to convert (e.g., "Nguyễn Văn A")</param>
    /// <returns>Slug format string (e.g., "nguyen-van-a")</returns>
    public static string ToSlug(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return string.Empty;

        // Convert Vietnamese characters to non-accented equivalents
        string normalized = RemoveVietnameseTones(text);

        // Convert to lowercase
        normalized = normalized.ToLowerInvariant();

        // Replace spaces and special characters with hyphens
        normalized = Regex.Replace(normalized, @"[^a-z0-9\s-]", "");
        normalized = Regex.Replace(normalized, @"\s+", "-");
        normalized = Regex.Replace(normalized, @"-+", "-");

        // Remove leading and trailing hyphens
        normalized = normalized.Trim('-');

        return normalized;
    }

    /// <summary>
    /// Generates a unique slug by checking existing slugs and appending number if needed
    /// </summary>
    /// <param name="text">Text to convert (e.g., "Nguyễn Văn A")</param>
    /// <param name="existingSlugs">Array of existing slugs from database</param>
    /// <returns>Unique slug (e.g., "nguyen-van-a", "nguyen-van-a-1", "nguyen-van-a-2")</returns>
    public static string GenerateUniqueSlug(string text, string[] existingSlugs)
    {
        if (string.IsNullOrWhiteSpace(text))
            throw new ArgumentException("Text cannot be null or empty", nameof(text));

        // Generate base slug
        string baseSlug = ToSlug(text);

        if (existingSlugs == null || existingSlugs.Length == 0)
            return baseSlug;

        // If base slug doesn't exist in the array, return it
        if (!existingSlugs.Contains(baseSlug))
            return baseSlug;

        // Find all matching slugs and determine the highest number
        int maxNumber = 0;
        string pattern = $@"^{Regex.Escape(baseSlug)}(?:-(\d+))?$";

        foreach (var slug in existingSlugs)
        {
            var match = Regex.Match(slug, pattern);
            if (match.Success)
            {
                if (match.Groups[1].Success && int.TryParse(match.Groups[1].Value, out int number))
                {
                    // Found slug with number suffix (e.g., "nguyen-van-a-2")
                    maxNumber = Math.Max(maxNumber, number);
                }
                else if (slug == baseSlug)
                {
                    // Found base slug without number, treat as 0
                    maxNumber = Math.Max(maxNumber, 0);
                }
            }
        }

        // Increment and return
        return $"{baseSlug}-{maxNumber + 1}";
    }

    /// <summary>
    /// Removes Vietnamese tone marks and converts to ASCII
    /// </summary>
    private static string RemoveVietnameseTones(string text)
    {
        // Vietnamese character mappings
        var vietnameseMap = new Dictionary<string, string>
            {
                // Lowercase vowels
                { "à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ", "a" },
                { "è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ", "e" },
                { "ì|í|ị|ỉ|ĩ", "i" },
                { "ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ", "o" },
                { "ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ", "u" },
                { "ỳ|ý|ỵ|ỷ|ỹ", "y" },
                { "đ", "d" },
                
                // Uppercase vowels
                { "À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ", "A" },
                { "È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ", "E" },
                { "Ì|Í|Ị|Ỉ|Ĩ", "I" },
                { "Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ", "O" },
                { "Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ", "U" },
                { "Ỳ|Ý|Ỵ|Ỷ|Ỹ", "Y" },
                { "Đ", "D" }
            };

        foreach (var pair in vietnameseMap)
        {
            text = Regex.Replace(text, pair.Key, pair.Value);
        }

        return text;
    }
}
