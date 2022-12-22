"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editReport = void 0;
const http_status_codes_1 = require("http-status-codes");
const constants_js_1 = require("../constants.js");
const axios_1 = __importDefault(require("axios"));
const constants_js_2 = require("../constants.js");
const editReport = async (req, res) => {
    const clickUpPersonalToken = 'pk_54034017_NSFPIW7VLMTT9P90BM2VU9PH89XEFUDH';
    const { data: { teams }, } = await (0, axios_1.default)(`${constants_js_1.CLICK_UP_BASE_URL_API}/team`, {
        headers: {
            Authorization: clickUpPersonalToken,
        },
    }).catch((e) => console.log(e));
    const teamId = teams[0].id;
    const { data } = await (0, axios_1.default)(`${constants_js_1.CLICK_UP_BASE_URL_API}/team/${teamId}/space`, {
        headers: {
            Authorization: clickUpPersonalToken,
        },
    });
    const helpDeskSpaceId = data.spaces.filter((space) => space.name === 'VisaNet Dominicana - HelpDesk')[0].id;
    const { data: responseFolders } = await (0, axios_1.default)(`${constants_js_1.CLICK_UP_BASE_URL_API}/space/${helpDeskSpaceId}/folder`, {
        headers: {
            Authorization: clickUpPersonalToken,
        },
    });
    const foldersId = responseFolders.folders.map((folder) => folder.id);
    let lists;
    lists = await Promise.all(foldersId.map(async (folderId) => {
        try {
            const { data } = await (0, axios_1.default)(`${constants_js_1.CLICK_UP_BASE_URL_API}/folder/${folderId}/list`, {
                headers: {
                    Authorization: clickUpPersonalToken,
                },
            });
            return data;
        }
        catch (error) {
            console.log(error);
        }
    }));
    const helpDeskLists = lists
        .map((list) => {
        return list.lists;
    })
        .flat(Infinity);
    const incidenciasInfraestructura = helpDeskLists.filter((list) => {
        return (list.folder.name.includes('Infraestructura') &&
            list.name.toLowerCase().includes('incidencias'));
    })[0].task_count;
    const incidenciasComunicaciones = helpDeskLists.filter((list) => {
        return (list.folder.name.includes('Comunicaciones') &&
            list.name.toLowerCase().includes('incidencias'));
    })[0].task_count;
    const incidencias = helpDeskLists
        .flat(Infinity)
        .filter((list) => list.name.toLowerCase().includes('incidencias'));
    const incidenciasId = incidencias.map((incidencia) => {
        return incidencia.id;
    });
    let tasks = [];
    tasks = await Promise.all(incidenciasId.map(async (incidenciaId) => {
        try {
            const { data } = await (0, axios_1.default)(`${constants_js_1.CLICK_UP_BASE_URL_API}/list/${incidenciaId}/task?content-type=${constants_js_1.CLICK_UP_CONTENT_TYPE}`, {
                headers: {
                    Authorization: clickUpPersonalToken,
                },
            });
            return data;
        }
        catch (error) {
            console.log(error);
        }
    }));
    const incidenciasTasks = tasks
        .map((incidencia) => incidencia.tasks)
        .flat(Infinity);
    const incidenciasCount = incidenciasTasks.reduce((count, incidencias) => {
        const incidenciaPlatform = incidencias.custom_fields
            .map((custom_field) => {
            if (custom_field.name !== 'PLATAFORMA/APP') {
                return;
            }
            return custom_field;
        })
            .filter((incidencia) => incidencia && incidencia !== undefined)[0]
            .value || [];
        const key = Object.keys(constants_js_2.PLATAFORMS).find((key) => incidenciaPlatform.includes(constants_js_2.PLATAFORMS[key]));
        if (!count[key]) {
            count[key] = 1;
        }
        else {
            count[key] = count[key] + 1;
        }
        return count;
    }, {});
    res.status(http_status_codes_1.StatusCodes.OK).json({
        ...incidenciasCount,
        comunicacion: incidenciasComunicaciones,
        infraestructura: incidenciasInfraestructura,
    });
};
exports.editReport = editReport;
//# sourceMappingURL=report.controller.js.map