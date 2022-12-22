"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasks = exports.getLists = exports.getFolders = exports.getSpaces = exports.getAuthorizedTeams = exports.getAccessToken = void 0;
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
            return data;
        }
        catch (error) {
            console.log(error);
        }
    }));
    res.status(http_status_codes_1.StatusCodes.OK).json(spaces);
};
exports.getSpaces = getSpaces;
const getFolders = async (req, res) => {
    const { spaces } = req.body;
    const accessToken = req.get('Authorization');
    const spacesId = spaces.map((space) => space?.id);
    let folders = [];
    folders = await Promise.all(spacesId.map(async (spaceId) => {
        try {
            const { data } = await (0, axios_1.default)(`${constants_js_1.CLICK_UP_BASE_URL_API}/space/${spaceId}/folder`, {
                headers: {
                    Authorization: accessToken,
                },
            });
            return data;
        }
        catch (error) {
            console.log(error);
        }
    }));
    const filteredFolders = folders.filter((folder) => folder.folders.length > 0);
    res.status(http_status_codes_1.StatusCodes.OK).json(filteredFolders);
};
exports.getFolders = getFolders;
const getLists = async (req, res) => {
    const { folders } = req.body;
    const accessToken = req.get('Authorization');
    const foldersId = folders.map((folder) => folder.id);
    console.log(folders);
    console.log(foldersId);
    let lists = [];
    lists = await Promise.all(foldersId.map(async (folderId) => {
        try {
            const { data } = await (0, axios_1.default)(`${constants_js_1.CLICK_UP_BASE_URL_API}/folder/${folderId}/list`, {
                headers: {
                    Authorization: accessToken,
                },
            });
            return data;
        }
        catch (error) {
            console.log(error);
        }
    }));
    res.status(http_status_codes_1.StatusCodes.OK).json(lists);
};
exports.getLists = getLists;
const getTasks = async (req, res) => {
    const { lists } = req.body;
    const accessToken = req.get('Authorization');
    const listsId = lists.map((folder) => folder.id);
    console.log(listsId);
    let tasks = [];
    tasks = await Promise.all(listsId.map(async (listId) => {
        try {
            const { data } = await (0, axios_1.default)(`${constants_js_1.CLICK_UP_BASE_URL_API}/list/${listId}/task?content-type=${constants_js_1.CLICK_UP_CONTENT_TYPE}`, {
                headers: {
                    Authorization: accessToken,
                },
            });
            return data;
        }
        catch (error) {
            console.log(error);
        }
    }));
    res.status(http_status_codes_1.StatusCodes.OK).json(tasks);
};
exports.getTasks = getTasks;
//# sourceMappingURL=clickUp.controller.js.map