import { sendRequest } from "./client";

const getServicesRequest = async (): Promise<any[]> => {
  try {
    const res = await sendRequest("service/GetServices", "GET");
    return res.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

const getServiceByIdRequest = async (id: string): Promise<any> => {
  try {
    const res = await sendRequest(`service/GetServiceById/${id}`, "GET");
    return res.data;
  } catch (error) {
    console.error(`Error fetching service with ID ${id}:`, error);
    throw error;
  }
};

const getServiceByTourIdRequest = async (id: string): Promise<any> => {
  try {
    const res = await sendRequest(`/service/GetServiceByTourId/${id}`, "GET");
    return res.data;
  } catch (error) {
    console.error(`Error fetching service for tour ID ${id}:`, error);
    throw error;
  }
};

const createServiceRequest = async (data: any): Promise<any> => {
  try {
    const res = await sendRequest("/service/CreateService", "POST", data);
    return res.data;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
};

const updateServiceRequest = async (id: string, data: any): Promise<any> => {
  try {
    const res = await sendRequest(`/service/UpdateService/${id}`, "PUT", data);
    return res.data;
  } catch (error) {
    console.error(`Error updating service with ID ${id}:`, error);
    throw error;
  }
};

export {
  getServicesRequest,
  getServiceByIdRequest,
  getServiceByTourIdRequest,
  createServiceRequest,
  updateServiceRequest,
};
