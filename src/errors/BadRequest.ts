import CustomAPIError from './CustomAPIError.js';
import { StatusCodes } from 'http-status-codes';

class BadRequest extends CustomAPIError {
  statusCode: StatusCodes;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default BadRequest;
