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
  superAdmin?: boolean;
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
