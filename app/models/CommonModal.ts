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
