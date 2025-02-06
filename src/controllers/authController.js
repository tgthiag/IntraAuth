//controllers/authController.js
import db from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Simple logging function
const log = (message, data = {}) => {
    console.log(`[${new Date().toISOString()}] ${message}`, data);
};

// **User Registration**
export const registerUser = async (req, res) => {
    const { username, password } = req.body;
    log('User registration attempt', { username });

    if (!username || !password) {
        log('Registration failed: Missing username or password');
        return res.status(400).json({ error: 'Username and password required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const [result] = await db.execute(
            'INSERT INTO intra_users (username, password_hash,is_enabled) VALUES (?, ?, 1)',
            [username, hashedPassword]
        );
        log('User registered successfully', { userId: result.insertId });
        res.json({ message: 'User registered successfully, waiting for admin approval', userId: result.insertId });
    } catch (error) {
        log('Error during registration', { error: error.message });
        res.status(500).json({ error: error.message });
    }
};

// **User Login**
export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    log('User login attempt', { username });

    if (!username || !password) {
        log('Login failed: Missing username or password');
        return res.status(400).json({ error: 'Username and password required' });
    }

    try {
        const [users] = await db.execute('SELECT * FROM intra_users WHERE username = ?', [username]);
        
        if (users.length === 0) {
            log('Login failed: User not found', { username });
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const user = users[0];

        if (!user.is_enabled) {
            log('Login failed: Account not activated', { username });
            return res.status(403).json({ error: 'Account not activated by admin' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            log('Login failed: Invalid password', { username });
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '5h' }
        );

        log('User logged in successfully', { username, userId: user.id });
        res.json({ token });
    } catch (error) {
        log('Error during login', { error: error.message });
        res.status(500).json({ error: error.message });
    }
};
