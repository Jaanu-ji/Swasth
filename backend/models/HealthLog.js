// ✅ Health Log Model
import mongoose from 'mongoose';

const healthLogSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, index: true },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'FamilyMember' },
  type: { type: String, enum: ['weight', 'height', 'bmi', 'bloodPressure', 'sugar', 'water', 'symptoms'], required: true },
  value: mongoose.Schema.Types.Mixed,
  notes: String,
}, { timestamps: true });

export default mongoose.model('HealthLog', healthLogSchema);

