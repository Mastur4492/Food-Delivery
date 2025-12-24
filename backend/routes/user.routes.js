import express from 'express';
import { getCurrentUser} from '../controllers/auth.controller.js';
import { isAuth } from '../middleware/Auth.middleware.js';

const userRouter = express.Router();

userRouter.route('/current-user').get(isAuth,getCurrentUser);

export default userRouter;