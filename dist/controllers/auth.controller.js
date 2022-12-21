"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAccessToken = exports.registerUserEmail = exports.checkUserExists = void 0;
const http_status_codes_1 = require("http-status-codes");
const client_1 = require("@prisma/client");
const errors_1 = __importDefault(require("../errors"));
const prisma = new client_1.PrismaClient();
const registerUserEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new errors_1.default.BadRequest('Por favor ingrese un email valido');
    }
    const isUserRegisterer = await prisma.user.findFirst({
        where: {
            email: email,
        },
    });
    if (isUserRegisterer) {
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ message: 'Usuario autentificado' });
    }
    const user = await prisma.user.create({
        data: {
            email: email,
            accessToken: '',
        },
    });
    console.log(user);
    res
        .status(http_status_codes_1.StatusCodes.CREATED)
        .json({ message: 'Usuario autentificado, redirigiendo a ClickUp' });
};
exports.registerUserEmail = registerUserEmail;
const saveAccessToken = async (req, res) => {
    const { accessToken, email } = req.body;
    if (!accessToken || !email) {
        throw new errors_1.default.BadRequest('Please provide valid values');
    }
    const user = await prisma.user.update({
        where: { email: email },
        data: {
            accessToken: accessToken,
        },
    });
    if (!user) {
        throw new errors_1.default.NotFound(`No user found with email: ${email}`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'Created access token' });
};
exports.saveAccessToken = saveAccessToken;
const checkUserExists = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new errors_1.default.BadRequest('Please provide a valid email');
    }
    const user = await prisma.user.findFirst({ where: { email: email } });
    if (!user) {
        throw new Error(`No user found with email: ${email}`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json(user);
};
exports.checkUserExists = checkUserExists;
//# sourceMappingURL=auth.controller.js.map