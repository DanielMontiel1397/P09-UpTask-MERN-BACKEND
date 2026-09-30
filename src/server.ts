import express from "express";
import dotenv from 'dotenv';
import { connectDB } from "./config/db";
import cors from 'cors'
import { corsConfig } from "./config/cors";

//Importacion de rutas
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import authRoutes from './routes/authRoutes'
import teamRoutes from './routes/teamRoutes'
import noteRoutes from './routes/noteRoutes'
import profileRoutes from './routes/profileRoutes';
import morgan from "morgan";

dotenv.config();


//CONECTARNOS A LA BASE DE DATOS
connectDB();

const app = express();

/////HABILITAR CORS
app.use(cors(corsConfig))

//Habilitar MORGAN
app.use(morgan('dev'));

///Habilitar lectura de formato json
app.use(express.json());

////RUTAS
app.use('/api/projects', projectRoutes);
app.use('/api/projects', taskRoutes);
app.use('/api/projects', teamRoutes);
app.use('/api/projects', noteRoutes);

app.use('/api/profile', profileRoutes);

app.use('/api/auth', authRoutes);

export default app;