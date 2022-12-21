"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const router = express_1.default.Router();
router.route('/check-user').post(auth_controller_1.checkUserExists);
router.route('/register').post(auth_controller_1.registerUserEmail);
router.route('/access-token').post(auth_controller_1.saveAccessToken);
exports.default = router;
//# sourceMappingURL=auth.router.js.map