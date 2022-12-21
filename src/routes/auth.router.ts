import express from 'express';
import {
  checkUserExists,
  registerUserEmail,
  saveAccessToken,
} from '../controllers/auth.controller';

const router = express.Router();

router.route('/check-user').post(checkUserExists);
router.route('/register').post(registerUserEmail);
router.route('/access-token').post(saveAccessToken);

export default router;
