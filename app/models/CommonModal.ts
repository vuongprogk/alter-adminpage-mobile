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
  tags: { id: string; name: string }[]; // Added tags field
  categories: { id: string; name: string }[]; // Added categories field
}
export interface TourFormInput {
  name: string;
  destination: string;
  price: number;
  startDate: string; // ISO format
  endDate: string;   // ISO format
  description: string;
  tags: string[]; // Added tags field (array of tag IDs)
  categories: string[]; // Added categories field (array of category IDs)
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
  userId: string; // Added userId field
  username: string;
  tourId: string;
  tourName: string; // Added tourName field
  bookingDate: string;
  quantity: number; // Added quantity field
  status: string; // Added status field
  totalPrice: number; // Added totalPrice field
}

export interface Service {
  id: string;
  tourId: string;
  name: string;
  description: string;
  price: number;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  description: string; // Added description field
}
