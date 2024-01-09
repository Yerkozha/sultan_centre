enum ROLES {
    ADMIN = 1,
    MANAGER = 2,
    CLIENT = 3
}

type AuthenticatedUser = {
    email: string;
    role: 1 | 2 | 3
}

export interface AuthResponse {
    access?: string;
    authenticatedUser: AuthenticatedUser;
    message: string;
    refresh?: string;
    statusCode: number;
    success: boolean;
}

export type UserCredentials = {
    email: string
    password: string
}

interface User {
  id: number;
  appointments: Appointment[]; // Assuming you have an Appointment type/interface
  last_login: string;
  uid: string;
  role: number;
  email: string;
  date_joined: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  create_date: string;
  modified_date: string;
  groups: any[]; // Adjust the type based on your actual data structure
  user_permissions: any[]; // Adjust the type based on your actual data structure
}

export interface Appointment {
    id: number;
    start: string;
    color: Nullable<string>
    end: string;
    status: "confirmed" | "pending" | "cancelled"; // Adjust based on actual status values
    title: string;
    summary: string;
}

export interface AppointmentCredentials {
    user_id: string
    title:string
    summary?: string
    color?: string
    start:string
    end: string
}

export interface UserList {
  success: boolean;
  status_code: number;
  message: string;
  users: User[];
}