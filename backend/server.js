// ✅ Swasth Backend Server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import dietRoutes from './routes/diet.js';
import emergencyRoutes from './routes/emergency.js';
import ocrRoutes from './routes/ocr.js';
import insightsRoutes from './routes/insights.js';
import familyRoutes from './routes/family.js';
import healthRoutes from './routes/health.js';

// ESM __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env only in dev
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TEMP uploads dir (not persistent on Render)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// MongoDB (STRICT)
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI not set');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/health', healthRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Swasth Backend API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});