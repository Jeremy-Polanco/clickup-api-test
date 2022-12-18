"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFolders = exports.getSpaces = exports.getAuthorizedTeams = exports.getAccessToken = void 0;
const http_status_codes_1 = require("http-status-codes");
const index_js_1 = require("../utils/index.js");
const index_js_2 = __importDefault(require("../errors/index.js"));
const constants_js_1 = require("../constants.js");
const axios_1 = __importDefault(require("axios"));
const getAccessToken = async (req, res) => {
    const { client_id, client_secret, code } = req.query;
    const response = await (0, index_js_1.getClickUpAccessToken)(client_id, client_secret, code).catch((err) => {
        throw new index_js_2.default.BadRequest(err);
    });
    res.status(http_status_codes_1.StatusCodes.OK).send({ ...response });
};
exports.getAccessToken = getAccessToken;
const getAuthorizedTeams = async (req, res) => {
    const accessToken = res.get('Authorization');
    const response = await (0, axios_1.default)(`${constants_js_1.CLICK_UP_BASE_URL_API}/team`, {
        headers: {
            Authorization: accessToken,
        },
    }).catch((e) => console.log(e));
    const authorizedTeams = response?.data;
    if (!authorizedTeams || authorizedTeams.length < 1) {
        throw new index_js_2.default.NotFound('No authorized teams found');
    }
    res.status(http_status_codes_1.StatusCodes.OK).send(authorizedTeams);
};
exports.getAuthorizedTeams = getAuthorizedTeams;
const getSpaces = async (req, res) => {
    const accessToken = req.get('Authorization');
    const teamsId = req?.body?.teamsId.map((team) => team?.id);
    let spaces = [];
    spaces = await Promise.all(teamsId.map(async (teamId) => {
        try {
            const { data } = await (0, axios_1.default)(`${constants_js_1.CLICK_UP_BASE_URL_API}/team/${teamId}/space`, {
                headers: {
                    Authorization: accessToken,
                },
            });
            const { id: spaceId, name: spaceName } = data.spaces[0];
            return { spaceId, spaceName };
        }
        catch (error) {
            console.log(error);
        }
    }));
    res.status(http_status_codes_1.StatusCodes.OK).json(spaces);
};
exports.getSpaces = getSpaces;
const getFolders = async (req, res) => {
    const accessToken = req.get('Authorization');
    // const spaceId = req?.body?.spaceId.map(
    //   (spaceId: { id: string }) => spaceId?.id
    // );
    console.log(req.body);
    // let folders: object[] = [];
    // folders = await Promise.all(
    //   spaceId.map(async (spaceId: string) => {
    //     try {
    //       const { data }: any = await axios(
    //         `${CLICK_UP_BASE_URL_API}/space/${spaceId}/folder`,
    //         {
    //           headers: {
    //             Authorization: accessToken,
    //           },
    //         }
    //       );
    //       // const { id: spaceId, name: spaceName } = data.spaces[0];
    //       return data;
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   })
    // );
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'folders' });
};
exports.getFolders = getFolders;
//# sourceMappingURL=clickUp.controller.js.map