// ✅ Health Log Routes
import express from 'express';
import HealthLog from '../models/HealthLog.js';

const router = express.Router();

// Get health logs
router.get('/:email', async (req, res) => {
  try {
    const logs = await HealthLog.find({ userEmail: req.params.email })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add health log
router.post('/', async (req, res) => {
  try {
    const { email, memberId, type, value, notes } = req.body;
    
    const log = new HealthLog({
      userEmail: email,
      memberId,
      type,
      value,
      notes,
    });
    
    await log.save();
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

