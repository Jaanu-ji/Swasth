// ✅ OCR Scan Model
import mongoose from 'mongoose';

const ocrScanSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, index: true },
  fileName: String,
  filePath: String,
  extractedText: String,
  extractedFields: mongoose.Schema.Types.Mixed,
  status: { type: String, enum: ['processing', 'completed', 'failed'], default: 'processing' },
}, { timestamps: true });

export default mongoose.model('OCRScan', ocrScanSchema);

