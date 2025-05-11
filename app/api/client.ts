import axios, { type AxiosRequestConfig, type Method } from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
  headers: {
    'Accept': 'application/json',
  },
  withCredentials: true,
});

export const sendRequest = async (
  url: string,
  method: Method,
  data: any = null,
  isFormData: boolean = false
) => {
  try {
    const config: AxiosRequestConfig = {
      url,
      method,
      headers: {},
    };

    if (data) {
      config.data = data;
      if (isFormData) {
        config.headers!['Content-Type'] = 'multipart/form-data';
      } else {
        config.headers!['Content-Type'] = 'application/json';
      }
    }

    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};
