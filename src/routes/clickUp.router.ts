import express from 'express';
import {
  getAccessToken,
  getAuthorizedTeams,
  getSpaces,
  getFolders,
  getLists,
  getTasks,
} from '../controllers/clickUp.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/access-token').get(getAccessToken);
router.route('/authorized-teams').get(authMiddleware, getAuthorizedTeams);
router.route('/spaces').post(authMiddleware, getSpaces);
router.route('/folder').post(authMiddleware, getFolders);
router.route('/list').post(authMiddleware, getLists);
router.route('/task').post(authMiddleware, getTasks);

export default router;
