import CustomAPIError from './CustomAPIError.js';
import { StatusCodes } from 'http-status-codes';

class NotFound extends CustomAPIError {
  statusCode: StatusCodes;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export default NotFound;
