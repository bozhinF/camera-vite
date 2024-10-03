import axios, { AxiosInstance } from 'axios';

const enum Default {
  BaseUrl = 'https://camera-shop.accelerator.htmlacademy.pro',
  Timeout = 5000,
}

export const createApi = (): AxiosInstance => {
  const api = axios.create({
    baseURL: Default.BaseUrl as string,
    timeout: Default.Timeout as number,
  });

  return api;
};
