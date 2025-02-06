import db from '../config/database.js';
import bcrypt from 'bcryptjs';

// **Listar todos os usuários**
export const getUsers = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, username, role, is_enabled, created_at FROM intra_users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
};

// **Criar um novo usuário**
export const createUser = async (req, res) => {
    const { username, password, role, is_enabled } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ error: 'Nome de usuário, senha e cargo são obrigatórios' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const [result] = await db.execute(
            'INSERT INTO intra_users (username, password_hash, role, is_enabled) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, role, is_enabled ?? 1]
        );
        res.json({ message: 'Usuário criado com sucesso', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
};

// **Atualizar um usuário**
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, role, is_enabled } = req.body;

    try {
        const [result] = await db.execute(
            'UPDATE intra_users SET username = ?, role = ?, is_enabled = ? WHERE id = ?',
            [username, role, is_enabled, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json({ message: 'Usuário atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
};

// **Excluir um usuário**
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.execute('DELETE FROM intra_users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir usuário' });
    }
};
