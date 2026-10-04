import express from 'express';
import { getProviderRecommendation } from '../controllers/ai.controller.js';

const router = express.Router();

// AI Recommendation Route
router.post('/recommend', getProviderRecommendation);

export default router;
