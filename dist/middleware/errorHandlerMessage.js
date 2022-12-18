"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const errorHandlerMiddleware = (req, res) => {
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ message: 'Something went wrong, please try again.' });
};
exports.default = errorHandlerMiddleware;
//# sourceMappingURL=errorHandlerMessage.js.map