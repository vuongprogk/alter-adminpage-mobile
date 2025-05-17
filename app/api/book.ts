import type { CreateBookingRequest } from "~/models/CommonModal";
import { sendRequest } from "./client";

const getBookingByIdRequest = async (id: string): Promise<any> => {
  try {
    const res = await sendRequest(`/book/GetById/${id}`, "GET");
    return res.data;
  } catch (error) {
    console.error(`Error fetching booking with ID ${id}:`, error);
    throw error;
  }
};

const createBookingRequest = async (data: CreateBookingRequest): Promise<any> => {
  try {
    const res = await sendRequest("/book", "POST", data);
    return res.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

const getBookingByUsernameRequest = async (username: string): Promise<any> => {
  try {
    const res = await sendRequest(`/book/GetBookByUsername/${username}`, "GET");
    return res.data;
  } catch (error) {
    console.error(`Error fetching booking for username ${username}:`, error);
    throw error;
  }
};

const getAllBooksRequest = async (): Promise<any[]> => {
  try {
    const res = await sendRequest("/book/GetBooksWithDetails", "GET");
    return res.data;
  } catch (error) {
    console.error("Error fetching all books:", error);
    throw error;
  }
};

export {
  getBookingByIdRequest,
  createBookingRequest,
  getBookingByUsernameRequest,
  getAllBooksRequest,
};
