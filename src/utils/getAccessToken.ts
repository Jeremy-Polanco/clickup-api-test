import { Response } from 'express';
import axios from 'axios';

const getAccessToken = async (
  clientId: string,
  clientSecret: string,
  userCode: string
) => {
  const url = `https://api.clickup.com/api/v2/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&code=${userCode}`;

  try {
    const { data } = await axios.post(url);

    return data;
  } catch (error: any) {
    console.log(error.response.data);
    throw error.response.data.err;
  }
};

export default getAccessToken;
