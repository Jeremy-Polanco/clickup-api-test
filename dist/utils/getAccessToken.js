"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const getAccessToken = async (clientId, clientSecret, userCode) => {
    const url = `https://api.clickup.com/api/v2/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&code=${userCode}`;
    try {
        const { data } = await axios_1.default.post(url);
        return data;
    }
    catch (error) {
        console.log(error.response.data);
        throw error.response.data.err;
    }
};
exports.default = getAccessToken;
//# sourceMappingURL=getAccessToken.js.map