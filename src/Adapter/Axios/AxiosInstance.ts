import axios, { AxiosInstance as AxiosType } from 'axios';
import { BASE_URL } from '../../Utils/ApiConfidentials';

export const AxiosInstance: AxiosType = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // timeout: AxiosTimeout,
  maxBodyLength: Infinity,
});
export const CancelToken = axios.CancelToken;
