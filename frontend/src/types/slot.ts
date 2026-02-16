export interface TimeSlot {
  id: number;
  doctorId: string; // UUID
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isBooked: boolean;
}

export interface CreateTimeSlot {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}
