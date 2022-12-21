import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import CustomErrors from '../errors';

const prisma = new PrismaClient();

const registerUserEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new CustomErrors.BadRequest('Por favor ingrese un email valido');
  }

  const isUserRegisterer = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (isUserRegisterer) {
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Usuario autentificado' });
  }

  const user = await prisma.user.create({
    data: {
      email: email,
      accessToken: '',
    },
  });

  console.log(user);

  res
    .status(StatusCodes.CREATED)
    .json({ message: 'Usuario autentificado, redirigiendo a ClickUp' });
};

const saveAccessToken = async (req: Request, res: Response) => {
  const { accessToken, email } = req.body;

  if (!accessToken || !email) {
    throw new CustomErrors.BadRequest('Please provide valid values');
  }

  const user = await prisma.user.update({
    where: { email: email },
    data: {
      accessToken: accessToken,
    },
  });

  if (!user) {
    throw new CustomErrors.NotFound(`No user found with email: ${email}`);
  }

  res.status(StatusCodes.OK).json({ message: 'Created access token' });
};

const checkUserExists = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new CustomErrors.BadRequest('Please provide a valid email');
  }

  const user = await prisma.user.findFirst({ where: { email: email } });

  if (!user) {
    throw new Error(`No user found with email: ${email}`);
  }

  res.status(StatusCodes.OK).json(user);
};

export { checkUserExists, registerUserEmail, saveAccessToken };
