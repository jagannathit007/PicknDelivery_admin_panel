import axios from 'axios';
import { BaseResponse } from './responses';

// Remove explicit AxiosResponse type and let TypeScript infer
export function isValidResponse<T>(response: unknown): response is { data: T & BaseResponse } {
  return (
    typeof response === 'object' &&
    response !== null &&
    'data' in response &&
    typeof response.data === 'object' &&
    response.data !== null &&
    'status' in response.data &&
    typeof response.data.status === 'number'
  );
}

export function isSuccessResponse<T>(response: { data: T & BaseResponse }): boolean {
  return response.data.status === 200;
}

export type ErrorWithMessage = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
};