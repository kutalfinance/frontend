export type APIResponse<T> = {
  msg: string;
  data: T;
};

export enum UserRoles {
  ADMIN = "ADMIN",
  AGENT = "AGENT",
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRoles;
  createdAt: string; // date-time
  updatedAt: string; // date-time
  isSuperAdmin?: boolean;
};

export type Agent = {
  id: string;
  name: string;
  email: string;
  role: UserRoles;
  branches?: Branch[];
  createdAt: string; // date-time
  updatedAt: string; // date-time
};

export type CustomerNextOfKin = {
  name: string;
  phoneNubmer: string;
  email: string;
};

export type Customer = {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  location: string;
  nextOfKin: CustomerNextOfKin;
  branch?: Branch;
  createdAt: string; // date-time
  updatedAt: string; // date-time
};

export type Branch = {
  id: string;
  name: string;
  location: string;
  agent?: User;
  customers?: Customer[];
  createdAt: string; // date-time
  updatedAt: string; // date-time
};

// ========== ADDITIONAL TYPES ==========

export type AdminMetrics = {
  totalUsers?: number;
  totalBranches?: number;
  totalCustomers?: number;
};

export type VerifyOtp = {
  email: string;
  otp: string;
};

export type LoginResponse = {
  message?: string;
  token?: string;
};

export type ResetPassword = {
  email: string;
  newPassword: string;
};

export type SendPasswordResetLink = {
  email: string;
};

export type AdminLogin = {
  email: string;
  password: string;
};
