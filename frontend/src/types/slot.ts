export interface TimeSlot {
  id: number;
  doctorId: string; // UUID
  date: string;     // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  isBooked: boolean;
}