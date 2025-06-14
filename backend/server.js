import express from "express";
import mongoose from "mongoose";
import * as dotenv from 'dotenv';
import cors from 'cors';



import http from 'http';
import { Server } from 'socket.io';
import bodyParser from "body-parser";


import authRouter from './routes/authRoutes.js'
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import SensorDataRoutes from "./routes/SensorRoutes.js";
import router from "./routes/BarragesRoutes.js";
import dams from "./routes/BarragePointsRoutes.js"
import geojsonRoutes from "./routes/geojson.js"
import contactRoutes from './routes/contactRoutes.js';
import forage from "./routes/ForagesRoutes.js";
import drilling from "./routes/ForagesPointsRoutes.js";
import nappe from "./routes/NappePhRoutes.js"
import nappep from "./routes/NappePRoutes.js"
import pedolog from "./routes/PedologieRoutes.js";
import cnbizerte from "./routes/CN_BZRoutes.js"
import del from "./routes/DelegationsBZRoutes.js"
import reseauHydr from "./routes/ReseauHydr.js"
import vertisol from "./routes/Vertisol_BZRoutes.js";
import climat from "./routes/climat_BZRoutes.js";
import geo from "./routes/GeologieRoutes.js";
import nappeph from "./routes/NappephPointsRoutes.js";
import nappepro from "./routes/NappepPointsRoutes.js"
import pedol from "./routes/PegologiePointsRoutes.js";
import vert from "./routes/Vertisol_BZPointsRoutes.js";
import climatbz from "./routes/ClimatPointRoutes.js"

dotenv.config();

const app = express(); // Create app instancefirst
export { app }; // Then export it
const allowedOrigins = ['http://localhost:5173']


const PORT = process.env.PORT || 5000;


//Receive sensor data from your IoT 
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: allowedOrigins, 
      credentials: true,
      methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: allowedOrigins,
    credentials: true, 
  }));


if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URL environment variable is not set!");
    process.exit(1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());



io.on('connection', (socket) => {
    console.log('Client connected');
  });
 

app.get('/', (request, response) => {
    return response.status(234).send(`Page Accueil`);
});
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api', SensorDataRoutes);
app.use('/api', contactRoutes);
app.use("/api/geojson", geojsonRoutes);
app.use('/api',router);
app.use("/api/dams",dams);

app.use('/api',forage);
app.use("/api",drilling);

app.use('/api',nappe)
app.use('/api',nappep)
app.use("/api",nappeph);


app.use('/api',pedolog)

app.use('/api',cnbizerte)

app.use('/api',del)
app.use('/api',reseauHydr)
app.use('/api',vertisol)
app.use('/api',climat)
app.use('/api',geo)
app.use('/api',nappepro)
app.use('/api',pedol)
app.use('/api',vert)

app.use('/api',climatbz)







mongoose.connect(process.env.MONGODB_URI || require('./config/mongo.js').uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
    .then(() => console.log("Database is connected successfully."))
    .catch(err => console.error('Error connecting to MongoDB', err));

  app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
async function connectPostgreSQL() {
  try {
    const { Pool } = await import('pg');
    const pool = new Pool({
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      port: process.env.PGPORT,
    });

    await pool.connect();
    console.log('Connected to PostgreSQL');
    return pool;
  } catch (err) {
    console.error('Error connecting to PostgreSQL', err);
    throw err;
  }
}
  connectPostgreSQL();
        