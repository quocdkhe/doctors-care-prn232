export const calculatePrice = (
  startTime: string,
  endTime: string,
  pricePerHour: number,
) => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const durationInMinutes =
    endHour * 60 + endMinute - (startHour * 60 + startMinute);
  const price = (pricePerHour * durationInMinutes) / 60;
  return price;
};

/**
 * Abbreviates a Vietnamese full name.
 * - "Nguyễn Văn Lâm" → "N.V.Lâm"
 * - If that result is longer than 5 characters → "V.Lâm" (only penultimate initial + last word)
 */
export const abbreviateVietnameseName = (fullName: string): string => {
  if (!fullName) return "";
  const words = fullName.trim().split(/\s+/);
  if (words.length <= 1) return fullName;

  const lastName = words[words.length - 1];
  const middleWords = words.slice(0, words.length - 1);

  // Full abbreviation: e.g. Đ.K.Quốc
  const full =
    middleWords.map((w) => w[0].toUpperCase()).join(".") + "." + lastName;

  if (full.length <= 5 || middleWords.length <= 2) return full;

  // Fallback: only keep penultimate initial + last word, e.g. V.Lâm
  const penultimate = middleWords[middleWords.length - 1];
  return penultimate[0].toUpperCase() + "." + lastName;
};
