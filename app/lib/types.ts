export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string; // date-time
  updatedAt: string; // date-time
  superAdmin?: boolean; // Optional field
};

export type UserRole = "ADMIN" | "AGENT";

export type Customer = {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  location: string;
  nextOfKin: {
    name: string;
    phoneNubmer: string;
    email: string;
  };
  branch?: Branch;
  createdAt: string; // date-time
  updatedAt: string; // date-time
};

export type Branch = {
  id: string;
  name: string;
  location: string;
  agent?: User; // Expanded field
  customers?: Customer[]; // Expanded field
  createdAt: string; // date-time
  updatedAt: string; // date-time
};
