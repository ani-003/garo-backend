import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

import authRoutes from './routes/authRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import ongoingRoutes from './routes/ongoingRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Load schedule JSON once
const schedulePath = path.resolve('data/truck_schedule.json');
const scheduleData = JSON.parse(fs.readFileSync(schedulePath, 'utf-8'));

// In-memory state to track status
const truckLandmarkState = {};

// Use routes (pass scheduleData and state if your routes are functions returning routers)
app.use('/api/auth', authRoutes);
app.use('/api/location', locationRoutes(scheduleData, truckLandmarkState));
app.use('/api', ongoingRoutes(scheduleData));

app.get('/', (req, res) => {
  res.send('🚀 Server is running...');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
