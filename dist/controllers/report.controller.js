"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editReport = void 0;
const http_status_codes_1 = require("http-status-codes");
const constants_js_1 = require("../constants.js");
const index_js_1 = __importDefault(require("../errors/index.js"));
const axios_1 = __importDefault(require("axios"));
const editReport = async (req, res) => {
    const clickUpPersonalToken = 'pk_54034017_NSFPIW7VLMTT9P90BM2VU9PH89XEFUDH';
    const { filePath, position } = req.body;
    if (!filePath || !position) {
        throw new index_js_1.default.BadRequest('Por favor envia informacion valida');
    }
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
    const helpDeskLists = lists.map((list) => {
        return list.lists;
    });
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
        const incidenciaPlatform = incidencias.custom_fields.filter((custom_field) => custom_field.name === 'PLATAFORMA/APP')[0];
        console.log(Object.values(incidenciaPlatform).includes(incidencias.custom_fields.filter(incidenciaPlatform).value));
        // if (
        //   count[
        //     incidencias.custom_fields.filter(
        //       (custom_field: any) => custom_field.name === 'PLATAFORMA/APP'
        //     )
        //   ]
        // ) {
        // }
    });
    /*  updateExcelPosition(filePath, position); */
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'Edit report' });
};
exports.editReport = editReport;
//# sourceMappingURL=report.controller.js.map