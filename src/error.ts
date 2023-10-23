import { AxiosResponse } from 'axios';
import { APIErrorResponse } from './types';

export function isErrorResponse(res: AxiosResponse<unknown>): res is AxiosResponse<APIErrorResponse> {
  return !res.status || res.status < 200 || 300 <= res.status;
}
