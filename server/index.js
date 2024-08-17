import express from 'express';
import UserRoutes from './routes/user.routes.js';
import { config } from 'dotenv';
import connectionToDatabase from './config/dbConfig.js';
import cookieParser from 'cookie-parser';

config();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use('/api/user', UserRoutes);

app.use('*', (req, res) => {
    res.status(400).send('Page not found');
});

app.listen(5050, async() => {

    await connectionToDatabase();
    console.log(`Server is running on http://localhost:5050`);
})