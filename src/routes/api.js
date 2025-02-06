//routes/api.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: 'Welcome!', user: req.user });
});

export default router;
