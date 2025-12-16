// ✅ OCR Routes
import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import OCRScan from '../models/OCRScan.js';
import Tesseract from 'tesseract.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Upload and process OCR
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { email } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const scan = new OCRScan({
      userEmail: email,
      fileName: file.filename,
      filePath: file.path,
      status: 'processing',
    });
    await scan.save();
    
    // Process OCR (simplified - in production use proper OCR service)
    try {
      const { data: { text } } = await Tesseract.recognize(file.path, 'eng');
      
      scan.extractedText = text;
      scan.extractedFields = { text };
      scan.status = 'completed';
      await scan.save();
      
      res.json({ 
        scanId: scan._id, 
        status: 'completed', 
        text, 
        fields: { text } 
      });
    } catch (ocrError) {
      scan.status = 'failed';
      await scan.save();
      res.json({ 
        scanId: scan._id, 
        status: 'failed', 
        text: 'OCR processing failed', 
        fields: {} 
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get OCR status
router.get('/status/:scanId', async (req, res) => {
  try {
    const scan = await OCRScan.findById(req.params.scanId);
    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }
    res.json({ status: scan.status, text: scan.extractedText, fields: scan.extractedFields });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get OCR history
router.get('/history/:email', async (req, res) => {
  try {
    const scans = await OCRScan.find({ userEmail: req.params.email })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(scans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

