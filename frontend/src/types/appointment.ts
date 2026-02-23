import { UserInfo } from "./user";

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

export interface AppointmentItem {
  appointmentId: string;
  date: string; // DateOnly → string (ISO format: YYYY-MM-DD)
  startTime: string;
  endTime: string;
  isBooked: boolean;
  status: AppointmentStatus;
  patientName: string;
}

export interface AppointmentDetail {
  appointmentId: string;
  date: string; // DateOnly → string (ISO format: YYYY-MM-DD)
  startTime: string; // TimeOnly → string (format: HH:mm)
  endTime: string; // TimeOnly → string (format: HH:mm)
  isBooked: boolean;
  status?: AppointmentStatus;
  bookByUser: UserInfo;
  patientName: string;
  patientGender: boolean; // true is female, false is male
  patientPhone: string;
  patientEmail: string;
  patientDateOfBirth: string; // DateOnly → string (ISO format: YYYY-MM-DD)
  patientAddress: string;
  reason: string;
  medicalRecordFileUrl?: string;
  updatedAt: string;
  createdAt: string;
}

export interface PatientAppointment {
  doctorName: string;
  doctorAvatar: string;
  clinicName: string;
  clinicAddress: string;
  startTime: string; // "HH:mm:ss"
  endTime: string; // "HH:mm:ss"
  date: string; // "YYYY-MM-DD"
  status: AppointmentStatus;
  reason: string;
  medicalRecordFileUrl?: string;
  patientName: string;
  patientGender: boolean; // true = female, false = male
  patientPhone: string;
  patientDateOfBirth: string; // "YYYY-MM-DD"
  patientAddress: string;
}
