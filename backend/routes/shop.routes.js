import express from 'express';
import { isAuth } from '../middleware/Auth.middleware.js';
import { createANDEditShop, getMyShop, deleteShop } from '../controllers/shop.controllers.js';
import { upload } from '../middleware/multer.js';

const shopRouter = express.Router();

shopRouter.route('/create-edit-shop').post(isAuth, upload.single('image'), createANDEditShop)
shopRouter.route('/get-my-shop').get(isAuth, getMyShop)
shopRouter.route('/delete-shop').delete(isAuth, deleteShop);
export default shopRouter;