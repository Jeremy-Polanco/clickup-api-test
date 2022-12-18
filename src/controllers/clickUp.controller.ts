import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getClickUpAccessToken } from '../utils/index.js';
import CustomErrors from '../errors/index.js';
import { CLICK_UP_BASE_URL_API } from '../constants.js';
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

  res.status(StatusCodes.OK).json({ message: 'folders' });
};

export { getAccessToken, getAuthorizedTeams, getSpaces, getFolders };
