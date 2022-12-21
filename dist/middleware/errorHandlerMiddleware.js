"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
    const defaultError = {
        message: err.message || 'Something went wrong, please try again later',
        statusCode: err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
    };
    if (err.code === 'P2002') {
        defaultError.message = `${err.message.split('(!')[1].split(')')[0]} already exists in the database`;
        defaultError.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
    res.status(defaultError.statusCode).json({ message: defaultError.message });
};
exports.default = errorHandlerMiddleware;
//# sourceMappingURL=errorHandlerMiddleware.js.map