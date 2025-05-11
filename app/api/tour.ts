import type { Tour, TourFormInput } from "~/models/CommonModal";
import { sendRequest } from "./client";

const getAllToursRequest = async (): Promise<Tour[]> => {
  const res = await sendRequest("/tour/GetTours", "GET");
  return res.data as Tour[];
};
const getTourByIdRequest = async (id: string): Promise<Tour> => {
  const res = await sendRequest(`/tour/GetTourById/${id}`, "GET");
  return res.data as Tour;
};
const createTourRequest = async (
  data: TourFormInput,
  imageFile: File
): Promise<any> => {
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
};
const updateTourRequest = async (
  id: string,
  data: TourFormInput,
  imageFile?: File
): Promise<any> => {
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
};

export { getAllToursRequest, getTourByIdRequest, createTourRequest, updateTourRequest };
