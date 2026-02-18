import { UserInfo } from "./user";

export interface CurrentDoctorProfile {
  id: string;
  user: UserInfo;
  biography: string | null;
  shortDescription: string | null;
  specialtyId: string | null;
  clinicId: string | null;
  pricePerHour: number;
}

export interface UpdateDoctorProfile {
  biography?: string;
  shortDescription?: string;
  specialtyId?: string;
  clinicId?: string;
  imageUrl?: string;
  fullName?: string;
  phone?: string;
  password?: string;
  pricePerHour: number;
}

export interface DoctorCard {
  slug: string;
  doctorName: string;
  imageUrl?: string;
  shortDescription?: string;
  pricePerHour: number;
  clinicSlug: string;
  clinicName: string;
  clinicAddress: string;
  clinicCity: string;
}
