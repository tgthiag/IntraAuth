//index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import db from './config/database.js';
import itemRoutes from './routes/itemRoutes.js';
import userRoutes from './routes/userRoutes.js';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);
app.use('/api/users', userRoutes);
app.get("/", (req, res) => {
    res.send("Server is running!");
  });
app.use('/api/items', itemRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT,"0.0.0.0", () => console.log(`Server running on http://localhost:${PORT}`));
