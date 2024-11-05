import { expect } from 'chai';
import {
  ClientError,
  ServerError,
  ValidationError,
  throwErrorFromResponse,
  OriginalErrorCode,
  APIResponse,
  APIErrorResponse,
} from '../../src';
import { AxiosResponse } from 'axios';

describe('Error Handling', () => {
  describe('Custom Error Classes', () => {
    const apiErrorResponse = {
      success: false,
      error: {
        detail: {
          code: OriginalErrorCode.clientError,
          message: 'Client error occurred',
        },
        type: OriginalErrorCode.clientError,
      },
    };

    it('ClientError should contain the correct properties', () => {
      const error = new ClientError('Client error', 400, apiErrorResponse);
      expect(error.message).to.equal('Client error');
      expect(error.status).to.equal(400);
      expect(error.code).to.equal(OriginalErrorCode.clientError);
      expect(error).to.be.instanceOf(Error);
    });

    it('ServerError should contain the correct properties', () => {
      const error = new ServerError('Server error', 500, apiErrorResponse);
      expect(error.message).to.equal('Server error');
      expect(error.status).to.equal(500);
      expect(error.code).to.equal(OriginalErrorCode.serverError);
      expect(error).to.be.instanceOf(Error);
    });

    it('ValidationError should contain the correct properties', () => {
      const error = new ValidationError('Validation error', 422, apiErrorResponse);
      expect(error.message).to.equal('Validation error');
      expect(error.status).to.equal(422);
      expect(error.code).to.equal(OriginalErrorCode.validationError);
      expect(error).to.be.instanceOf(Error);
    });
  });

  describe('throwErrorFromResponse Function', () => {
    it('should throw ClientError for client error responses', () => {
      const mockResponse: AxiosResponse<APIErrorResponse> = {
        status: 400,
        data: {
          error: {
            type: OriginalErrorCode.clientError,
            detail: [{ message: 'Client error occurred', code: OriginalErrorCode.clientError }],
          },
          success: false,
        },
        statusText: 'Bad Request',
        headers: {},
        config: {},
      };
      expect(() => throwErrorFromResponse(mockResponse)).to.throw(ClientError);
    });

    it('should throw ServerError for server error responses', () => {
      const mockResponse: AxiosResponse<APIErrorResponse> = {
        status: 500,
        data: {
          error: {
            type: OriginalErrorCode.serverError,
            detail: [{ message: 'Server error occurred', code: OriginalErrorCode.serverError }],
          },
          success: false,
        },
        statusText: 'Bad Request',
        headers: {},
        config: {},
      };
      expect(() => throwErrorFromResponse(mockResponse)).to.throw(ServerError);
    });

    it('should throw ValidationError for validation error responses', () => {
      const mockResponse: AxiosResponse<APIErrorResponse> = {
        status: 422,
        data: {
          error: {
            type: OriginalErrorCode.validationError,
            detail: [{ message: 'Validation error occurred', code: OriginalErrorCode.validationError }],
          },
          success: false,
        },
        statusText: 'Bad Request',
        headers: {},
        config: {},
      };
      expect(() => throwErrorFromResponse(mockResponse)).to.throw(ValidationError);
    });

    it('should throw ClientError for 404 Not Found responses', () => {
      const mockResponse: AxiosResponse<APIErrorResponse> = {
        status: 404,
        data: {
          error: {
            type: OriginalErrorCode.clientError,
            detail: [{ message: 'Resource not found', code: OriginalErrorCode.clientError }],
          },
          success: false,
        },
        statusText: 'Not Found',
        headers: {},
        config: {},
      };
      expect(() => throwErrorFromResponse(mockResponse))
        .to.throw(ClientError)
        .with.property('message', 'Resource not found');
    });

    it('should throw a generic Error from axios statusText when error detail is missing', () => {
      const mockResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: {},
        data: {
          error: {
            type: OriginalErrorCode.serverError,
            // Detail is omitted or undefined
          } as any,
          success: false,
        },
      };
      expect(() => throwErrorFromResponse(mockResponse))
        .to.throw(ServerError)
        .with.property('message', 'Internal Server Error');
    });

    it('should throw a generic Error for unknown error types', () => {
      const mockResponse = {
        status: 418,
        statusText: 'Teapot',
        headers: {},
        config: {},
        data: {
          error: {
            type: 'unknown_error',
            detail: [{ message: "I'm a teapot" }],
          },
        },
      } as any;
      expect(() => throwErrorFromResponse(mockResponse)).to.throw(Error);
    });
  });
});
