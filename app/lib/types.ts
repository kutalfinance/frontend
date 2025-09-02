type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string; // date-time
  updatedAt: string; // date-time
  superAdmin?: boolean; // Optional field
};

type UserRole = "ADMIN" | "AGENT";
