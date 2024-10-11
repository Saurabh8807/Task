import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes/index.routes'; 
import cors from 'cors';

const app: Application = express(); 
console.log(app)
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true 
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.use(cookieParser());

app.use('/api/v1', routes);

export { app };
