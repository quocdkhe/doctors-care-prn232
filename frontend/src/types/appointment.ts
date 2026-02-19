export interface Appointment {
  id: string;
  bookByUserId: string;
  patientName: string;
  patientGender: boolean; // true = female, false = male
  patientPhone: string;
  patientEmail: string;
  patientDateOfBirth: string; // DateOnly → string (ISO format: YYYY-MM-DD)
  patientAddress: string;
  reason: string;
  timeSlotId: number;
  status: AppointmentStatus;
  medicalRecordFileUrl?: string;
  updatedAt: string;
  createdAt: string;
}

export enum AppointmentStatus {
  Scheduled = "Scheduled",
  Cancelled = "Cancelled",
  Completed = "Completed",
}

export interface CreateAppointment {
  bookByUserId: string;
  timeSlotId: number;
  patientName: string;
  patientGender: boolean;
  patientPhone: string;
  patientEmail: string;
  patientDateOfBirth: string; // ISO date string: "YYYY-MM-DD"
  patientAddress: string;
  reason: string;
}