import express from 'express';
import { getItems, addItem, updateItem, deleteItem } from '../controllers/itemController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getItems);
router.post('/', authenticateToken, addItem);
router.put('/:alias', authenticateToken, updateItem);
router.delete('/:alias', authenticateToken, deleteItem);

export default router;
