import express from 'express';
import { addItem, editItem, deleteItem } from '../controllers/items.controllers.js';
import { isAuth } from '../middleware/Auth.middleware.js';
import { upload } from '../middleware/multer.js';


const itemRouter = express.Router();
itemRouter.route('/add-item').post(isAuth, upload.single('image'), addItem);
itemRouter.route('/edit-item/:itemId').put(isAuth, upload.single('image'), editItem);
itemRouter.route('/delete-item/:itemId').delete(isAuth, deleteItem);

export default itemRouter;