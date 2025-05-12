import type { CreateUserRequest, Role, UpdateUserRequest } from "~/models/CommonModal";
import { sendRequest } from "./client";

// GET /api/user/GetUsers
export const getAllUsersRequest = async () => {
  try {
    const res = await sendRequest("/user/GetUsers", "GET");
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// GET /api/user/GetUserById/{id}
export const getUserByIdRequest = async (id: string) => {
  try {
    const res = await sendRequest(`/user/GetUserById/${id}`, "GET");
    return res.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

// POST /api/user
export const createUserRequest = async (data: CreateUserRequest) => {
  try {
    const res = await sendRequest("/user", "POST", data);
    return res.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// PUT /api/user/UpdateUser/{id}
export const updateUserRequest = async (id: string, data: UpdateUserRequest) => {
  try {
    const res = await sendRequest(`/user/UpdateUser/${id}`, "PUT", data);
    return res.data;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

// PUT /api/user/UpdateUserRole/{id}
export const updateUserRoleRequest = async (userId: string, role: number) => {
  try {
    const res = await sendRequest(`/user/UpdateUserRole/${userId}`, "PUT", role); // Send role directly as a number
    return res.data;
  } catch (error) {
    console.error(`Error updating role for user with ID ${userId}:`, error);
    throw error;
  }
};

// GET /api/user/GetUsersByRole/{role}
export const getUsersByRoleRequest = (role: string) =>
  sendRequest(`/user/GetUsersByRole/${role}`, "GET");
