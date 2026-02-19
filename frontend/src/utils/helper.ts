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
