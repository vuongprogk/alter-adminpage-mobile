import axios, { type AxiosRequestConfig, type Method } from 'axios';
import appConfig from '~/config/appConfig';

const cache = new Map();

export const apiClient = axios.create({
  baseURL: appConfig.api.baseUrl,
  timeout: appConfig.api.timeout,
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
  const cacheKey = `${method}:${url}`;
  if (method === 'GET' && cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

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
    if (method === 'GET') {
      cache.set(cacheKey, response.data);
    }
    return response.data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};
