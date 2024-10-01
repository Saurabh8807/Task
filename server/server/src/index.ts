import dotenv from 'dotenv';
import { app } from './app'; 
import connectDB from './db/index'; 
dotenv.config({});

const port: number = parseInt(process.env.PORT || '8000', 10);

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err: Error) => {
        console.error('MongoDB Connection Failed !!!', err);
    });
