export interface CurrentUserInfo {
  id: number;
  fullName: string;
  phone?: string;
  email: string;
  role: UserRoleEnum;
  avatar?: string;
}

export enum UserRoleEnum {
  Admin = "Admin",
  Doctor = "Doctor",
  Patient = "Patient",
}
