import type { Tour, TourFormInput } from "~/models/CommonModal";
import { sendRequest } from "./client";

const getAllToursRequest = async (): Promise<Tour[]> => {
  try {
    const res = await sendRequest("/tour/GetTours", "GET");
    return res.data as Tour[];
  } catch (error) {
    console.error("Error fetching tours:", error);
    throw error;
  }
};

const getTourByIdRequest = async (id: string): Promise<Tour> => {
  try {
    const res = await sendRequest(`/tour/GetTourById/${id}`, "GET");
    return res.data as Tour;
  } catch (error) {
    console.error(`Error fetching tour with ID ${id}:`, error);
    throw error;
  }
};

const createTourRequest = async (
  data: TourFormInput,
  imageFile: File
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("Name", data.name);
    formData.append("Destination", data.destination);
    formData.append("Price", data.price.toString());
    formData.append("StartDate", data.startDate);
    formData.append("EndDate", data.endDate);
    formData.append("Description", data.description);
    formData.append("Image", imageFile);

    const response = await sendRequest(
      "/tour/CreateTour",
      "POST",
      formData,
      true
    );
    return response.data;
  } catch (error) {
    console.error("Error creating tour:", error);
    throw error;
  }
};

const updateTourRequest = async (
  id: string,
  data: TourFormInput,
  imageFile?: File
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("Name", data.name);
    formData.append("Destination", data.destination);
    formData.append("Price", data.price.toString());
    formData.append("StartDate", data.startDate);
    formData.append("EndDate", data.endDate);
    formData.append("Description", data.description);
    if (imageFile) {
      formData.append("Image", imageFile);
    }

    const response = await sendRequest(
      `/tour/UpdateTour/${id}`,
      "PUT",
      formData,
      true
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating tour with ID ${id}:`, error);
    throw error;
  }
};

const updateTourCategoriesAndTagsRequest = async (
  tourId: string,
  data: { CategoryIds: number[]; TagIds: number[] }
): Promise<any> => {
  try {
    const body = {
      categoryIds: data.CategoryIds,
      tagIds: data.TagIds,
    };
    const response = await sendRequest(
      `/tour/UpdateTourCategoriesAndTags/${tourId}`,
      "PUT",
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error updating tour categories and tags:", error);
    throw error;
  }
};

const updateTourServicesRequest = async (
  tourId: string,
  data: { serviceId: string[] }
): Promise<any> => {
  try {
    const body = {
      serviceId: data.serviceId,
    };
    const response = await sendRequest(
      `/service/UpdateTourService/${tourId}`,
      "PUT",
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error updating tour services:", error);
    throw error;
  }
};

export {
  getAllToursRequest,
  getTourByIdRequest,
  createTourRequest,
  updateTourRequest,
  updateTourCategoriesAndTagsRequest,
  updateTourServicesRequest,
};
