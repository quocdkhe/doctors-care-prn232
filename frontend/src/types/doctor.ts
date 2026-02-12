import { UserInfo } from "./user";

export interface CurrentDoctorProfile {
  id: string;
  user: UserInfo;
  biography: string | null;
  specialtyId: string | null;
  clinicId: string | null;
}
