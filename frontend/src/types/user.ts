export interface UserInfo extends UserRegister {
  id: number;
  role: UserRoleEnum;
  avatar?: string;
}

export enum UserRoleEnum {
  Admin = "Admin",
  Doctor = "Doctor",
  Patient = "Patient",
}

export interface UserRegister {
  fullName: string;
  phone?: string;
  email: string;
  password: string;
}

export interface AdminCreateUser extends Omit<UserRegister, "password"> {
  role: UserRoleEnum;
}
