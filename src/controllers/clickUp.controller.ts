import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getClickUpAccessToken } from '../utils/index.js';
import CustomErrors from '../errors/index.js';
import { CLICK_UP_BASE_URL_API, CLICK_UP_CONTENT_TYPE } from '../constants.js';
import axios from 'axios';

const getAccessToken = async (req: Request, res: Response) => {
  const { client_id, client_secret, code } = req.query;

  const response = await getClickUpAccessToken(
    client_id as string,
    client_secret as string,
    code as string
  ).catch((err) => {
    throw new CustomErrors.BadRequest(err);
  });

  res.status(StatusCodes.OK).send({ ...response });
};

const getAuthorizedTeams = async (req: Request, res: Response) => {
  const accessToken = res.get('Authorization');

  const response = await axios(`${CLICK_UP_BASE_URL_API}/team`, {
    headers: {
      Authorization: accessToken,
    },
  }).catch((e) => console.log(e));

  const authorizedTeams = response?.data;

  if (!authorizedTeams || authorizedTeams.length < 1) {
    throw new CustomErrors.NotFound('No authorized teams found');
  }

  res.status(StatusCodes.OK).send(authorizedTeams);
};

const getSpaces = async (req: Request, res: Response) => {
  const accessToken = req.get('Authorization');

  const teamsId = req?.body?.teamsId.map((team: { id: string }) => team?.id);

  let spaces: object[] = [];

  spaces = await Promise.all(
    teamsId.map(async (teamId: string) => {
      try {
        const { data }: any = await axios(
          `${CLICK_UP_BASE_URL_API}/team/${teamId}/space`,
          {
            headers: {
              Authorization: accessToken,
            },
          }
        );
        const { id: spaceId, name: spaceName } = data.spaces[0];
        return { spaceId, spaceName };
      } catch (error) {
        console.log(error);
      }
    })
  );

  res.status(StatusCodes.OK).json(spaces);
};
const getFolders = async (req: Request, res: Response) => {
  const { spaces } = req.body;
  const accessToken = req.get('Authorization');

  const spacesId = spaces.map((space: { spaceId: string }) => space?.spaceId);

  let folders: object[] = [];

  folders = await Promise.all(
    spacesId.map(async (spaceId: string) => {
      try {
        const { data }: any = await axios(
          `${CLICK_UP_BASE_URL_API}/space/${spaceId}/folder`,
          {
            headers: {
              Authorization: accessToken,
            },
          }
        );
        return data;
      } catch (error) {
        console.log(error);
      }
    })
  );

  res.status(StatusCodes.OK).json(folders);
};

const getLists = async (req: Request, res: Response) => {
  const { folders } = req.body;
  const accessToken = req.get('Authorization');

  const foldersId = folders.map((folder: { id: string }) => folder.id);

  console.log(foldersId);

  let lists: object[] = [];

  lists = await Promise.all(
    foldersId.map(async (folderId: string) => {
      try {
        const { data }: any = await axios(
          `${CLICK_UP_BASE_URL_API}/folder/${folderId}/list`,
          {
            headers: {
              Authorization: accessToken,
            },
          }
        );
        return data;
      } catch (error) {
        console.log(error);
      }
    })
  );

  res.status(StatusCodes.OK).json(lists);
};

const getTasks = async (req: Request, res: Response) => {
  const { lists } = req.body;
  const accessToken = req.get('Authorization');

  const listsId = lists.map((folder: { id: string }) => folder.id);

  console.log(listsId);

  let tasks: object[] = [];

  tasks = await Promise.all(
    listsId.map(async (listId: string) => {
      try {
        const { data }: any = await axios(
          `${CLICK_UP_BASE_URL_API}/list/${listId}/task?content-type=${CLICK_UP_CONTENT_TYPE}`,
          {
            headers: {
              Authorization: accessToken,
            },
          }
        );
        return data;
      } catch (error) {
        console.log(error);
      }
    })
  );

  res.status(StatusCodes.OK).json(tasks);
};

export {
  getAccessToken,
  getAuthorizedTeams,
  getSpaces,
  getFolders,
  getLists,
  getTasks,
};
