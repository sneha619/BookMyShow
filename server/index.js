import express from 'express';
import UserRoutes from './routes/user.routes.js';
import { config } from 'dotenv';
import connectionToDatabase from './config/dbConfig.js';
import cookieParser from 'cookie-parser';
import MovieRoutes from './routes/movie.routes.js';
import ShowRoute from './routes/shows.routes.js';
import cors from 'cors';

config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.use('/api/user', UserRoutes);

app.use('/api/movie', MovieRoutes);

app.use('/api/show', ShowRoute);

app.use('*', (req, res) => {
    res.status(400).send({ message: 'Page not found' });
});

app.listen(5050, async() => {

    await connectionToDatabase();
    console.log(`Server is running on http://localhost:5050`);
})