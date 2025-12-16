// ✅ AI Insights Routes
import express from 'express';
import axios from 'axios';
import User from '../models/User.js';
import Diet from '../models/Diet.js';
import HealthLog from '../models/HealthLog.js';

const router = express.Router();

// Get AI insights
router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    const recentDiets = await Diet.find({ userEmail: req.params.email }).sort({ createdAt: -1 }).limit(5);
    const recentLogs = await HealthLog.find({ userEmail: req.params.email }).sort({ createdAt: -1 }).limit(10);
    
    // Generate insights (simplified)
    const insights = [
      {
        category: 'Fitness',
        priority: 'high',
        title: 'Increase Daily Activity',
        description: 'You\'ve been below your step goal this week. Try a 15-minute walk after lunch.',
        action: 'Set Reminder',
      },
      {
        category: 'Nutrition',
        priority: 'medium',
        title: 'Boost Protein Intake',
        description: 'Your protein consumption is below recommended. Add eggs or Greek yogurt to breakfast.',
        action: 'View Recipes',
      },
    ];
    
    const healthGoals = [
      {
        goal: 'Lose 3kg by January',
        progress: 40,
        tip: 'You\'re on track! Continue your current calorie deficit and add 2 more workout sessions per week.',
      },
    ];
    
    const personalizedTips = [
      'Based on your activity, the best time for your workout is 7-9 AM',
      'You tend to skip breakfast on Mondays - try meal prepping on Sundays',
    ];
    
    res.json({ insights, healthGoals, personalizedTips });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate insights
router.post('/generate/:email', async (req, res) => {
  try {
    // Same as GET, but can trigger AI generation
    const user = await User.findOne({ email: req.params.email });
    
    // Generate using AI if API key available
    if (process.env.OPENAI_API_KEY) {
      // AI generation logic here
    }
    
    res.json({ message: 'Insights generated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

