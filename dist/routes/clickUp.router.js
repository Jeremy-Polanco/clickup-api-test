"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clickUp_controller_js_1 = require("../controllers/clickUp.controller.js");
const authMiddleware_js_1 = __importDefault(require("../middleware/authMiddleware.js"));
const router = express_1.default.Router();
router.route('/access-token').get(clickUp_controller_js_1.getAccessToken);
router.route('/authorized-teams').get(authMiddleware_js_1.default, clickUp_controller_js_1.getAuthorizedTeams);
router.route('/spaces').post(authMiddleware_js_1.default, clickUp_controller_js_1.getSpaces);
router.route('/folder').post(authMiddleware_js_1.default, clickUp_controller_js_1.getFolders);
exports.default = router;
//# sourceMappingURL=clickUp.router.js.map