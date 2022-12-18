"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomAPIError_js_1 = __importDefault(require("./CustomAPIError.js"));
const http_status_codes_1 = require("http-status-codes");
class NotFound extends CustomAPIError_js_1.default {
    statusCode;
    constructor(message) {
        super(message);
        this.statusCode = http_status_codes_1.StatusCodes.NOT_FOUND;
    }
}
exports.default = NotFound;
//# sourceMappingURL=notFound.js.map