import { sendRequest } from "./client";
import type { Tag, Category } from "~/models/CommonModal";

// Tags API
export const createTag = async (tag: Tag): Promise<any> => {
  return sendRequest("/TourRelevent/tags", "POST", tag);
};

export const updateTag = async (tag: Tag): Promise<any> => {
  return sendRequest("/TourRelevent/tags", "PUT", tag);
};

export const deleteTag = async (tag: Tag): Promise<any> => {
  return sendRequest("/TourRelevent/tags", "DELETE", tag);
};

export const getTags = async (): Promise<Tag[]> => {
  const res = await sendRequest("/TourRelevent/tags", "GET");
  return res.result as Tag[];
};

export const searchTags = async (name: string): Promise<Tag[]> => {
  const res = await sendRequest(`/TourRelevent/tags/search?name=${name}`, "GET");
  return res.result as Tag[];
};

// Categories API
export const createCategory = async (category: Category): Promise<any> => {
  return sendRequest("/TourRelevent/categories", "POST", category);
};

export const updateCategory = async (category: Category): Promise<any> => {
  return sendRequest("/TourRelevent/categories", "PUT", category);
};

export const deleteCategory = async (category: Category): Promise<any> => {
  return sendRequest("/TourRelevent/categories", "DELETE", category);
};

export const getCategories = async (): Promise<Category[]> => {
  const res = await sendRequest("/TourRelevent/categories", "GET");
  return res.result as Category[];
};

export const searchCategories = async (name: string): Promise<Category[]> => {
  const res = await sendRequest(`/TourRelevent/categories/search?name=${name}`, "GET");
  return res.result as Category[];
};
