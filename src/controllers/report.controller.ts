import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { CLICK_UP_BASE_URL_API, CLICK_UP_CONTENT_TYPE } from '../constants.js';
import CustomError from '../errors/index.js';
import axios from 'axios';
import { PLATAFORMS } from '../constants.js';

const editReport = async (req: Request, res: Response) => {
  const clickUpPersonalToken: string =
    'pk_54034017_NSFPIW7VLMTT9P90BM2VU9PH89XEFUDH';

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

  const helpDeskLists = lists
    .map((list: { lists: any }) => {
      return list.lists;
    })
    .flat(Infinity);

  const incidenciasInfraestructura = helpDeskLists.filter(
    (list: { name: string; folder: { name: string } }) => {
      return (
        list.folder.name.includes('Infraestructura') &&
        list.name.toLowerCase().includes('incidencias')
      );
    }
  )[0].task_count;

  const incidenciasComunicaciones = helpDeskLists.filter(
    (list: { name: string; folder: { name: string } }) => {
      return (
        list.folder.name.includes('Comunicaciones') &&
        list.name.toLowerCase().includes('incidencias')
      );
    }
  )[0].task_count;

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
    const incidenciaPlatform =
      incidencias.custom_fields
        .map((custom_field: any) => {
          if (custom_field.name !== 'PLATAFORMA/APP') {
            return;
          }
          return custom_field;
        })
        .filter((incidencia: any) => incidencia && incidencia !== undefined)[0]
        .value || [];

    const key: unknown = Object.keys(PLATAFORMS).find((key: string) =>
      incidenciaPlatform.includes(PLATAFORMS[key])
    );

    if (!count[key as string]) {
      count[key as string] = 1;
    } else {
      count[key as string] = count[key as string] + 1;
    }

    return count;
  }, {});

  res.status(StatusCodes.OK).json({
    ...incidenciasCount,
    comunicacion: incidenciasComunicaciones,
    infraestructura: incidenciasInfraestructura,
  });
};

export { editReport };
