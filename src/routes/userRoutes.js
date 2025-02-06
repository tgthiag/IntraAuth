import express from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getUsers);  // Listar usuários
router.post('/', authenticateToken, createUser);  // Criar usuário
router.put('/:id', authenticateToken, updateUser);  // Atualizar usuário
router.delete('/:id', authenticateToken, deleteUser);  // Excluir usuário

export default router;
