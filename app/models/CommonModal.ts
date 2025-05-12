export interface User {
  username: string;
  password: string;
}

export interface Tour{
  id: string;
  name: string;
  destination: string;
  price: number;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  description: string;
  imageUrl: string;
}
export interface TourFormInput {
  name: string;
  destination: string;
  price: number;
  startDate: string; // ISO format
  endDate: string;   // ISO format
  description: string;
}

export interface CreateUserRequest {
  userName: string;
  password: string;
  role: number;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

export interface Role {
  role: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface CreateBookingRequest {
  username: string;
  tourId: string;
  bookingDate: string;
}

export interface Booking {
  id: string;
  username: string;
  tourId: string;
  bookingDate: string;
}

export interface Service {
  id: string;
  tourId: string;
  name: string;
  description: string;
}
