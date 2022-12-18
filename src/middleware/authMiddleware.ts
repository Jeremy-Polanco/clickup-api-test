import { Request, Response, NextFunction } from 'express';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers?.authorization;

  res.header('Authorization', `Bearer ${accessToken}`);

  next();
};

export default authMiddleware;
