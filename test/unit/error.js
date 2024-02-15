import { expect } from 'chai';
import { ClientError, ServerError, ValidationError, throwErrorFromResponse, OriginalErrorCode } from '../../dist';

describe('Error Handling', () => {
	describe('Custom Error Classes', () => {
		it('ClientError should contain the correct properties', () => {
			const error = new ClientError('Client error', 400, {}, OriginalErrorCode.clientError);
			expect(error.message).to.equal('Client error');
			expect(error.status).to.equal(400);
			expect(error.code).to.equal(OriginalErrorCode.clientError);
			expect(error).to.be.instanceOf(Error);
		});

		it('ServerError should contain the correct properties', () => {
			const error = new ServerError('Server error', 500, {}, OriginalErrorCode.serverError);
			expect(error.message).to.equal('Server error');
			expect(error.status).to.equal(500);
			expect(error.code).to.equal(OriginalErrorCode.serverError);
			expect(error).to.be.instanceOf(Error);
		});

		it('ValidationError should contain the correct properties', () => {
			const error = new ValidationError('Validation error', 422, {}, OriginalErrorCode.validationError);
			expect(error.message).to.equal('Validation error');
			expect(error.status).to.equal(422);
			expect(error.code).to.equal(OriginalErrorCode.validationError);
			expect(error).to.be.instanceOf(Error);
		});
	});

	describe('throwErrorFromResponse Function', () => {
		it('should throw ClientError for client error responses', () => {
			const mockResponse = {
				status: 400,
				data: {
					error: {
						type: OriginalErrorCode.clientError,
						detail: [{ message: 'Client error occurred' }],
					},
				},
			};
			expect(() => throwErrorFromResponse(mockResponse)).to.throw(ClientError);
		});

		it('should throw ServerError for server error responses', () => {
			const mockResponse = {
				status: 500,
				data: {
					error: {
						type: OriginalErrorCode.serverError,
						detail: [{ message: 'Server error occurred' }],
					},
				},
			};
			expect(() => throwErrorFromResponse(mockResponse)).to.throw(ServerError);
		});

		it('should throw ValidationError for validation error responses', () => {
			const mockResponse = {
				status: 422,
				data: {
					error: {
						type: OriginalErrorCode.validationError,
						detail: [{ message: 'Validation error occurred' }],
					},
				},
			};
			expect(() => throwErrorFromResponse(mockResponse)).to.throw(ValidationError);
		});

		it('should throw ClientError for 404 Not Found responses', () => {
			const mockResponse = {
				status: 404,
				data: {
					error: {
						type: OriginalErrorCode.clientError,
						detail: [{ message: 'Resource not found' }],
					},
				},
			};
			expect(() => throwErrorFromResponse(mockResponse))
				.to.throw(ClientError)
				.with.property('message', 'Resource not found');
		});

		it('should throw a generic Error from axios statusText when error detail is missing', () => {
			const mockResponse = {
				status: 500,
				statusText: 'Internal Server Error',
				data: {
					error: {
						type: OriginalErrorCode.serverError,
						// Detail is omitted or undefined
					},
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
				data: {
					error: {
						type: 'unknown_error',
						detail: [{ message: "I'm a teapot" }],
					},
				},
			};
			expect(() => throwErrorFromResponse(mockResponse)).to.throw(Error);
		});
	});
});
