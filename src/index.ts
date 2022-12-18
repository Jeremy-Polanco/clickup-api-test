import 'express-async-errors';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import clickUpRouter from './routes/clickUp.router.js';
import notFoundMiddleware from './middleware/notFoundMiddleware.js';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';

dotenv.config();
const app: Express = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api/v1/click-up', clickUpRouter);

const port = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
  res.send('API development');
});

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   const post = await prisma.post.update({
//     where: { id: 1 },
//     data: { published: true },
//   });
//   console.log(post);
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
