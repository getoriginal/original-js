import { AxiosResponse } from 'axios';

export enum OriginalErrorCode {
  clientError = 'client_error',
  serverError = 'server_error',
  validationError = 'validation_error',
}

export type ErrorResponseDetail = {
  code: OriginalErrorCode;
  message: string;
  field_name?: string;
};

export type APIErrorResponse = {
  success: boolean;
  error?: {
    detail: ErrorResponseDetail | ErrorResponseDetail[];
    type: OriginalErrorCode;
  }
};

export class OriginalError extends Error {
  status: number;
  data: unknown;
  code: OriginalErrorCode;

  constructor(message: string, status: number, data: unknown, code: OriginalErrorCode) {
    super(message);
    this.status = status;
    this.data = data;
    this.code = code;
  }
}

export class ClientError extends OriginalError {
  constructor(message: string, status: number, data: unknown) {
    super(message, status, data, OriginalErrorCode.clientError);
  }
}

export class ServerError extends OriginalError {
  constructor(message: string, status: number, data: unknown) {
    super(message, status, data, OriginalErrorCode.serverError);
  }
}

export class ValidationError extends OriginalError {
  constructor(message: string, status: number, data: unknown) {
    super(message, status, data, OriginalErrorCode.validationError);
  }
}

export function isErrorResponse(res: AxiosResponse<unknown>): res is AxiosResponse<APIErrorResponse> {
  // Consider only client errors (400-499) and server errors (500-599) as errors.
  return res.status < 200 || res.status >= 400;
}

export function throwErrorFromResponse(res: AxiosResponse<APIErrorResponse>) {
  const errorType = res?.data?.error?.type;
  const errorStatus = res?.status;
  const errorMessage = getFirstErrorDetailMessage(res?.data?.error?.detail);
  const errorData = res?.data;

  if (errorType === OriginalErrorCode.clientError) {
    throw new ClientError(errorMessage, errorStatus, errorData);
  } else if (errorType === OriginalErrorCode.serverError) {
    throw new ServerError(errorMessage, errorStatus, errorData);
  } else if (errorType === OriginalErrorCode.validationError) {
    throw new ValidationError(errorMessage, errorStatus, errorData);
  } else {
    throw new Error(errorMessage);
  }
}

const getFirstErrorDetailMessage = (detail: ErrorResponseDetail[] | ErrorResponseDetail | undefined) => {
  if (Array.isArray(detail)) {
    return detail[0].message ?? 'Unknown error';
  }
  return detail?.message ?? 'Unknown error';
};
