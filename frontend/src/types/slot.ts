export interface TimeSlot {
  id: number;
  doctorId: string; // UUID
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isBooked: boolean;
  appointment: unknown;
}

export interface CreateTimeSlot {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface SlotDetail {
  slotId: number;
  startTime: string;
  endTime: string;
  date: string;
  isBooked: boolean;
  doctorName: string;
  imageUrl: string;
  doctorSlug: string;
  pricePerHour: number;
  clinicAddress: string;
  clinicName: string;
  specialtySlug: string;
  specialtyName: string;
}
