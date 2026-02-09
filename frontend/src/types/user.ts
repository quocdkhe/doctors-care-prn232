export interface UserInfo extends Register {
  id: number;
  role: UserRoleEnum;
  avatar?: string;
}

export enum UserRoleEnum {
  Admin = "Admin",
  Doctor = "Doctor",
  Patient = "Patient",
}

export interface Register {
  fullName: string;
  phone?: string;
  email: string;
  password: string;
}

export interface AdminCreateUser extends Omit<Register, "password"> {
  role: UserRoleEnum;
}

export interface Login {
  email: string;
  password: string;
}

export interface UserUpdateProfile {
  fullName: string;
  phone: string;
  avatar?: string;
  password?: string;
}
