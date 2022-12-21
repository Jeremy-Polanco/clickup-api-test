import express from 'express';
import { editReport } from '../controllers/report.controller';

const router = express.Router();

router.route('/').post(editReport);

export default router;
