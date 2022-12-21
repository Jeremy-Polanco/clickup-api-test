import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import updateExcelPosition from '../utils/updateExcelPosition.js';
import { CLICK_UP_BASE_URL_API, CLICK_UP_CONTENT_TYPE } from '../constants.js';
import CustomError from '../errors/index.js';
import axios from 'axios';
import { PLATAFORMS } from '../constants.js';

const editReport = async (req: Request, res: Response) => {
  const clickUpPersonalToken: string =
    'pk_54034017_NSFPIW7VLMTT9P90BM2VU9PH89XEFUDH';

  const { filePath, position } = req.body;

  if (!filePath || !position) {
    throw new CustomError.BadRequest('Por favor envia informacion valida');
  }

  const {
    data: { teams },
  }: any = await axios(`${CLICK_UP_BASE_URL_API}/team`, {
    headers: {
      Authorization: clickUpPersonalToken,
    },
  }).catch((e) => console.log(e));

  const teamId = teams[0].id;

  const { data }: any = await axios(
    `${CLICK_UP_BASE_URL_API}/team/${teamId}/space`,
    {
      headers: {
        Authorization: clickUpPersonalToken,
      },
    }
  );

  const helpDeskSpaceId = data.spaces.filter(
    (space: { name: string }) => space.name === 'VisaNet Dominicana - HelpDesk'
  )[0].id;

  const { data: responseFolders }: any = await axios(
    `${CLICK_UP_BASE_URL_API}/space/${helpDeskSpaceId}/folder`,
    {
      headers: {
        Authorization: clickUpPersonalToken,
      },
    }
  );

  const foldersId = responseFolders.folders.map(
    (folder: { id: string }) => folder.id
  );

  let lists: any;

  lists = await Promise.all(
    foldersId.map(async (folderId: string) => {
      try {
        const { data }: any = await axios(
          `${CLICK_UP_BASE_URL_API}/folder/${folderId}/list`,
          {
            headers: {
              Authorization: clickUpPersonalToken,
            },
          }
        );
        return data;
      } catch (error) {
        console.log(error);
      }
    })
  );

  const helpDeskLists = lists.map((list: { lists: any }) => {
    return list.lists;
  });

  const incidencias = helpDeskLists
    .flat(Infinity)
    .filter((list: { name: string }) =>
      list.name.toLowerCase().includes('incidencias')
    );

  const incidenciasId = incidencias.map((incidencia: { id: string }) => {
    return incidencia.id;
  });

  let tasks: object[] = [];

  tasks = await Promise.all(
    incidenciasId.map(async (incidenciaId: string) => {
      try {
        const { data }: any = await axios(
          `${CLICK_UP_BASE_URL_API}/list/${incidenciaId}/task?content-type=${CLICK_UP_CONTENT_TYPE}`,
          {
            headers: {
              Authorization: clickUpPersonalToken,
            },
          }
        );
        return data;
      } catch (error) {
        console.log(error);
      }
    })
  );

  const incidenciasTasks = tasks
    .map((incidencia: any) => incidencia.tasks)
    .flat(Infinity);

  const incidenciasCount = incidenciasTasks.reduce((count, incidencias) => {
    const incidenciaPlatform = incidencias.custom_fields.filter(
      (custom_field: any) => custom_field.name === 'PLATAFORMA/APP'
    )[0];

    console.log(
      Object.values(incidenciaPlatform).includes(
        incidencias.custom_fields.filter(incidenciaPlatform).value
      )
    );

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

  res.status(StatusCodes.OK).json({ message: 'Edit report' });
};

export { editReport };
